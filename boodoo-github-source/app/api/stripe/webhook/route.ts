import { NextResponse } from 'next/server';
import { readRecord, replaceRecord } from '@/lib/server/commerce-store';
import { type BookOrder, applyPaidSession, orderPath, runFulfillment, verifyStripeEvent } from '@/lib/server/book-commerce';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook unavailable.' }, { status: 503 });
  let event;
  try {
    event = verifyStripeEvent(await request.text(), request.headers.get('stripe-signature'), secret);
  } catch {
    return NextResponse.json({ error: 'Invalid Stripe webhook signature.' }, { status: 400 });
  }
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded',
    'checkout.session.async_payment_failed', 'checkout.session.expired'].includes(event.type)) {
    return NextResponse.json({ received: true });
  }
  const session = event.data.object;
  const meta = session.metadata as Record<string, string> | undefined;
  const uid = meta?.ownerUid;
  const id = meta?.bookOrderId;
  if (!uid || !id || !/^[a-zA-Z0-9_-]+$/.test(uid) || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: 'Missing order metadata.' }, { status: 400 });
  }
  try {
    const path = orderPath(uid, id);
    const stored = await readRecord<BookOrder>(path);
    if (!stored || stored.data.stripeSessionId !== session.id) {
      return NextResponse.json({ error: 'Stripe session does not match an order.' }, { status: 409 });
    }
    const order = stored.data;
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      if (session.payment_status !== 'paid') return NextResponse.json({ received: true, awaitingPayment: true });
      if (order.status === 'awaiting_payment') {
        const paid = await applyPaidSession(order, session);
        await replaceRecord(path, paid, stored.updateTime);
        if (process.env.PRINT_FULFILLMENT_ENABLED === 'true') await runFulfillment(uid, id);
      } else if (order.status === 'paid' && order.fulfillmentState === 'not_started' &&
        process.env.PRINT_FULFILLMENT_ENABLED === 'true') {
        await runFulfillment(uid, id);
      } else if (order.status === 'creating_checkout') {
        return NextResponse.json({ error: 'Order not committed; retry webhook.' }, { status: 503 });
      }
    } else if (order.status === 'awaiting_payment') {
      const state = event.type === 'checkout.session.expired' ? 'cancelled' : 'payment_failed';
      await replaceRecord(path, { ...order, status: state, updatedAt: new Date().toISOString() }, stored.updateTime);
    }
    return NextResponse.json({ received: true });
  } catch {
    // HTTP 5xx asks Stripe to retry transient DB processing failures.
    // Prodigi errors are recorded on the order and can be retried with the same idempotencyKey.
    return NextResponse.json({ error: 'Order update failed; retry.' }, { status: 503 });
  }
}

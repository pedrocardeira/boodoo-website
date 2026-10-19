import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { readRecord, replaceRecord } from '@/lib/server/commerce-store';
import { type BookOrder, getProdigiDetails, mergeProdigiDetails, orderPath } from '@/lib/server/book-commerce';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  const secret = process.env.PRODIGI_CALLBACK_SECRET || '';
  const token = new URL(request.url).searchParams.get('token') || '';
  if (!secret || secret.length < 24 || token.length !== secret.length ||
      !timingSafeEqual(Buffer.from(token), Buffer.from(secret))) {
    return NextResponse.json({ error: 'Unauthorized callback.' }, { status: 401 });
  }
  // Prodigi callbacks do not have Stripe-style signed payloads.
  // Fetch the canonical order from Prodigi using our server key, then validate
  // merchantReference, account and persistent order ID before accepting a status.
  try {
    const event = await request.json() as { subject?: string; id?: string; type?: string; data?: { order?: { id?: string } } };
    const prodigiId = event.data?.order?.id || event.subject;
    if (!event.id?.startsWith('evt_') || !event.type?.startsWith('com.prodigi.') ||
        !prodigiId?.startsWith('ord_')) {
      return NextResponse.json({ error: 'Invalid supplier event.' }, { status: 400 });
    }
    const details = await getProdigiDetails(prodigiId);
    const parts = details.merchantReference?.split(':') || [];
    if (parts.length !== 2 || parts.some(x => !/^[a-zA-Z0-9_-]+$/.test(x))) {
      return NextResponse.json({ error: 'Unrecognized supplier order.' }, { status: 409 });
    }
    const [uid, id] = parts;
    const path = orderPath(uid, id);
    const stored = await readRecord<BookOrder>(path);
    if (!stored || stored.data.fulfillmentState !== 'submitted') {
      return NextResponse.json({ error: 'Supplier order not ready for status update.' }, { status: 409 });
    }
    const updated = mergeProdigiDetails(stored.data, details);
    if (JSON.stringify(updated.tracking) !== JSON.stringify(stored.data.tracking) ||
        updated.prodigiStage !== stored.data.prodigiStage) {
      await replaceRecord(path, updated, stored.updateTime);
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Callback verification or order update failed.' }, { status: 503 });
  }
}

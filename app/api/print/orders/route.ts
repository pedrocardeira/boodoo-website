import { NextResponse } from 'next/server';
import { listRecords, readRecord, replaceRecord, verifiedUser } from '@/lib/server/commerce-store';
import { type BookOrder, orderPath, refreshProdigi, runFulfillment } from '@/lib/server/book-commerce';

export const runtime = 'nodejs';
export async function GET(request: Request) {
  let uid: string;
  try { uid = (await verifiedUser(request)).uid; }
  catch { return NextResponse.json({ error: 'Sign in to view orders.' }, { status: 401 }); }
  try {
    const orders = await listRecords<BookOrder>('users/' + uid + '/bookOrders');
    // Never expose children, signed print-file URLs, recipient address or supplier credentials.
    const safe = orders
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(o => ({
        id: o.id, albumId: o.albumId, createdAt: o.createdAt,
        status: o.status, amountTotal: o.amountTotal,
        currency: o.currency, countryCode: o.countryCode,
        prodigiStage: o.prodigiStage || null, tracking: o.tracking || [],
      }));
    return NextResponse.json({ orders: safe }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'Order history unavailable.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let actor;
  try { actor = await verifiedUser(request); }
  catch { return NextResponse.json({ error: 'Authentication required.' }, { status: 401 }); }
  const admins = (process.env.PRINT_ADMIN_UIDS || '').split(',').map(x => x.trim());
  if (!admins.includes(actor.uid)) return NextResponse.json({ error: 'Order maintenance is restricted.' }, { status: 403 });
  let data: { uid?: string; orderId?: string; action?: string };
  try { data = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (!data.uid || !data.orderId || !/^[a-zA-Z0-9_-]+$/.test(data.uid) ||
      !/^[a-zA-Z0-9_-]+$/.test(data.orderId)) {
    return NextResponse.json({ error: 'Invalid order.' }, { status: 400 });
  }
  try {
    const path = orderPath(data.uid, data.orderId);
    const existing = await readRecord<BookOrder>(path);
    if (!existing) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    if (data.action === 'retry-fulfillment') {
      // This is safe to retry because Prodigi receives the same permanent idempotencyKey.
      if (!['paid', 'fulfillment_error'].includes(existing.data.status)) {
        return NextResponse.json({ error: 'Order is not eligible for retry.' }, { status: 409 });
      }
      await runFulfillment(data.uid, data.orderId);
    } else if (data.action === 'refresh-status') {
      const current = await refreshProdigi(existing.data);
      if (current.prodigiStage !== existing.data.prodigiStage) await replaceRecord(path, current, existing.updateTime);
    } else return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
    const result = await readRecord<BookOrder>(path);
    return NextResponse.json({
      status: result?.data.status, prodigiStage: result?.data.prodigiStage || null,
      requiresReview: result?.data.status === 'fulfillment_error',
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Order update failed; inspect before retrying.' }, { status: 503 });
  }
}

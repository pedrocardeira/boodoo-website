import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { assertHouseholdMember, createRecord, getAlbumSummary, readRecord, replaceRecord, verifiedUser } from '@/lib/server/commerce-store';
import { type BookManifest, type BookOrder, checkedPrice, checkoutEnabled, createStripeSession, manifestPath, minimumRetailTotal, orderPath, shippingPriceId, verifyApprovedManifest, verifySupplierQuote } from '@/lib/server/book-commerce';

export const runtime = 'nodejs';

function bad(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(request: Request) {
  if (!checkoutEnabled()) return bad('Printed book checkout is not available yet.', 503);
  // A public payment must never be enabled until paid orders can be fulfilled.
  if (process.env.PRINT_FULFILLMENT_ENABLED !== 'true' || !process.env.STRIPE_WEBHOOK_SECRET ||
      !process.env.FIREBASE_SERVICE_ACCOUNT_JSON || !process.env.PRODIGI_API_KEY) {
    return bad('Print ordering is not fully configured.', 503);
  }
  const liveKey = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_');
  if (liveKey && (process.env.BOOK_COMMERCE_LIVE_ENABLED !== 'true' ||
      process.env.PRODIGI_ENVIRONMENT !== 'production')) return bad('Live printing is not approved.', 503);
  if (!liveKey && process.env.PRODIGI_ENVIRONMENT === 'production') return bad('Test payments cannot create live print jobs.', 503);

  let user;
  try { user = await verifiedUser(request); }
  catch { return bad('Please sign in to order your book.', 401); }

  let input: { albumId?: string; countryCode?: string };
  try { input = await request.json(); }
  catch { return bad('Invalid checkout request.'); }

  const albumId = input?.albumId;
  const country = input?.countryCode?.toUpperCase();
  if (!albumId || !/^[a-zA-Z0-9_-]{1,128}$/.test(albumId) || !country || !/^[A-Z]{2}$/.test(country)) {
    return bad('Select a saved album and supported destination.');
  }

  try {
    const album = await getAlbumSummary(user.uid, albumId);
    if (!album) return bad('Save your album before ordering.', 404);
    await assertHouseholdMember(user.uid, album.childID);
    const approved = await readRecord<BookManifest>(manifestPath(user.uid, albumId));
    const manifest = approved?.data;
    if (!manifest || manifest.albumId !== albumId || manifest.childID !== album.childID ||
        manifest.albumUpdatedAt !== album.updatedAt) {
      return bad('This album needs a new print-ready approval before ordering.', 409);
    }
    verifyApprovedManifest(user.uid, manifest);

    const bookPriceId = process.env.STRIPE_BOOK_PRICE_ID;
    if (!bookPriceId) return bad('Book retail price has not been configured.', 503);
    const [bookPrice, shippingPrice] = await Promise.all([
      checkedPrice(bookPriceId), checkedPrice(shippingPriceId(country)),
    ]);
    if (bookPrice.currency !== shippingPrice.currency || bookPrice.livemode !== shippingPrice.livemode) {
      return bad('Book and shipping prices must use the same currency and environment.', 503);
    }
    const supplier = await verifySupplierQuote(manifest, country);
    const margin = Number(process.env.BOOK_MIN_GROSS_MARGIN_PERCENT);
    if (!process.env.BOOK_MIN_GROSS_MARGIN_PERCENT || !Number.isFinite(margin)) {
      return bad('Retail margin approval is not configured.', 503);
    }
    if (bookPrice.currency !== supplier.currency ||
        bookPrice.unit_amount + shippingPrice.unit_amount <
          minimumRetailTotal(supplier.supplierTotalCents, margin)) {
      return bad('Retail prices do not cover approved production, delivery, and margin.', 503);
    }

    const id = randomUUID();
    const now = new Date().toISOString();
    const order: BookOrder = {
      id, uid: user.uid, albumId, childID: album.childID,
      status: 'creating_checkout', fulfillmentState: 'not_started',
      createdAt: now, updatedAt: now,
      amountTotal: bookPrice.unit_amount + shippingPrice.unit_amount, currency: bookPrice.currency,
      countryCode: country, productPriceId: bookPrice.id, shippingPriceId: shippingPrice.id,
      manifest,
    };
    const path = orderPath(user.uid, id);
    await createRecord(path, order);
    try {
      const session = await createStripeSession(order, user.email, new URL(request.url).origin);
      const current = await readRecord<BookOrder>(path);
      if (!current) throw new Error('Order could not be persisted.');
      await replaceRecord(path, {
        ...order, status: 'awaiting_payment', stripeSessionId: session.id, updatedAt: new Date().toISOString(),
      }, current.updateTime);
      return NextResponse.json({ url: session.url, orderId: id }, { headers: { 'Cache-Control': 'no-store' } });
    } catch {
      const current = await readRecord<BookOrder>(path);
      if (current) await replaceRecord(path, { ...current.data, status: 'payment_failed', updatedAt: new Date().toISOString() }, current.updateTime);
      throw new Error('Unable to prepare book checkout.');
    }
  } catch (error) {
    // Expected readiness and configuration errors may be shown; never return secrets or raw provider responses.
    const msg = error instanceof Error ? error.message : 'Checkout unavailable.';
    const publicError = /approved|configured|not available|cannot quote|valid Stripe price|shipping|destination|checkout|album|book|family|payment|photo|untrusted|supplier|Prodigi|retail/i.test(msg)
      ? msg : 'Could not start checkout. Please try again.';
    return bad(publicError, 503);
  }
}

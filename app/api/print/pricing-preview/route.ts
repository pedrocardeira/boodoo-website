import { NextResponse } from 'next/server';
import { verifiedUser } from '@/lib/server/commerce-store';
import { minimumRetailTotal, verifySupplierQuote } from '@/lib/server/book-commerce';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  let user;
  try { user = await verifiedUser(request); }
  catch { return NextResponse.json({ error: 'Authentication required.' }, { status: 401 }); }
  const admins = (process.env.PRINT_ADMIN_UIDS || '').split(',').map(x => x.trim());
  if (!admins.includes(user.uid)) return NextResponse.json({ error: 'Pricing is restricted.' }, { status: 403 });
  let data: { countryCode?: string; pageCount?: number };
  try { data = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid pricing request.' }, { status: 400 }); }
  const country = data.countryCode?.toUpperCase() || '';
  const count = data.pageCount;
  if (!/^[A-Z]{2}$/.test(country) || !Number.isInteger(count) ||
      count! < 24 || count! > 300 || count! % 2 !== 0) {
    return NextResponse.json({ error: 'Choose a valid country and even hardcover page count (24-300).' }, { status: 400 });
  }
  try {
    const sku = process.env.PRODIGI_BOOK_SKU;
    if (!sku) throw new Error('Select and verify a Prodigi book SKU.');
    const quote = await verifySupplierQuote({
      sku, assets: [{ printArea: 'default', pageCount: count!, url: 'https://example.com/not-an-order.pdf' }],
    }, country);
    const configuredMargin = process.env.BOOK_MIN_GROSS_MARGIN_PERCENT;
    const margin = configuredMargin ? Number(configuredMargin) : null;
    const minRetailCents = margin === null ? null : minimumRetailTotal(quote.supplierTotalCents, margin);
    return NextResponse.json({
      sku, countryCode: country, pageCount: count, supplier: quote,
      targetGrossMarginPercent: margin,
      minimumRetailCents: minRetailCents,
      recommendedBookPriceCents: minRetailCents === null ? null : Math.max(0, minRetailCents - quote.shippingCents),
      recommendedShippingPriceCents: quote.shippingCents,
      currency: 'usd',
      important: 'Supplier costs are not VAT/sales tax, Stripe processing fees, refunds or a guaranteed retail price. Approve amounts before creating Stripe Prices.',
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'Supplier quote unavailable or not approved.' }, { status: 503 });
  }
}

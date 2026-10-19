import { createHmac, timingSafeEqual } from 'node:crypto';
import { readRecord, replaceRecord } from './commerce-store';
import { signedProofUrl } from './gcs-print-proof';

export type BookManifest = {
  albumId: string; albumUpdatedAt: string; childID: string;
  sku: string; pageCount: number; approved: true; approvedBy: string;
  assets: Array<{ printArea: string; url: string; pageCount: number; storagePath?: string; generation?: string }>;
  approvedAt: string; signature?: string;
};
export type BookOrder = {
  id: string; uid: string; albumId: string; childID: string;
  status: 'creating_checkout'|'awaiting_payment'|'paid'|'payment_failed'|'cancelled'|'sent_to_print'|'fulfillment_error';
  fulfillmentState: 'not_started'|'submitting'|'submitted'|'error';
  createdAt: string; updatedAt: string; stripeSessionId?: string;
  amountTotal: number; currency: string; countryCode: string;
  productPriceId: string; shippingPriceId: string;
  manifest: BookManifest;
  recipient?: ProdigiRecipient;
  prodigiId?: string; prodigiStage?: string; tracking?: Array<{ url?: string; number?: string }>; lastError?: string;
};
export type ProdigiRecipient = {
  name: string;
  email?: string;
  address: {
    line1: string; line2?: string; postalOrZipCode: string;
    countryCode: string; townOrCity: string; stateOrCounty?: string;
  };
};
export function orderPath(uid: string, id: string): string {
  return 'users/' + uid + '/bookOrders/' + id;
}
export function manifestPath(uid: string, albumId: string): string {
  return 'users/' + uid + '/printManifests/' + albumId;
}
export function checkoutEnabled(): boolean {
  return process.env.STRIPE_CHECKOUT_ENABLED === 'true';
}
function stripeKey(): string {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe server key not configured.');
  return process.env.STRIPE_SECRET_KEY;
}
async function stripeFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch('https://api.stripe.com/v1/' + path, {
    ...init,
    headers: {
      Authorization: 'Bearer ' + stripeKey(),
      ...(init?.body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
      ...(init?.headers || {}),
    }, cache: 'no-store', signal: AbortSignal.timeout(15000),
  });
}
export type StripePrice = { id: string; active: boolean; currency: string; unit_amount: number; type: string; recurring?: unknown; livemode: boolean };
export async function checkedPrice(id: string): Promise<StripePrice> {
  if (!/^price_[a-zA-Z0-9]+$/.test(id)) throw new Error('Missing valid Stripe price.');
  const response = await stripeFetch('prices/' + encodeURIComponent(id));
  if (!response.ok) throw new Error('Stripe price could not be verified.');
  const value = await response.json() as StripePrice;
  if (!value.active || value.id !== id || value.type !== 'one_time' || value.recurring ||
      !Number.isSafeInteger(value.unit_amount) || value.unit_amount <= 0 ||
      !/^[a-z]{3}$/.test(value.currency)) throw new Error('Stripe price is not an active one-time price.');
  const expectedLive = stripeKey().startsWith('sk_live_');
  if (value.livemode !== expectedLive) throw new Error('Stripe price environment mismatch.');
  return value;
}
export function shippingPriceId(country: string): string {
  const raw = process.env.STRIPE_SHIPPING_PRICE_IDS_JSON;
  if (!raw) throw new Error('Shipping prices have not been configured.');
  const map = JSON.parse(raw) as Record<string, string>;
  const id = map[country];
  if (!/^[A-Z]{2}$/.test(country) || !id) throw new Error('No supported shipping option for this destination.');
  return id;
}

function requireHTTPS(value: string): boolean {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; }
  catch { return false; }
}
export function validateManifest(input: BookManifest): void {
  if (!input || input.approved !== true || !input.approvedBy || !input.albumId ||
      !input.childID || !input.albumUpdatedAt || !/^\d{4}-\d\d-\d\dT/.test(input.approvedAt) ||
      !Number.isInteger(input.pageCount) || input.pageCount < 24 ||
      input.pageCount > 300 || input.pageCount % 2 !== 0 ||
      input.sku !== process.env.PRODIGI_BOOK_SKU ||
      !Array.isArray(input.assets) || input.assets.length === 0 || input.assets.length > 3) {
    throw new Error('This album does not have an approved print-ready manifest.');
  }
  const hosts = (process.env.PRINT_ASSET_HOSTS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  if (!hosts.length) throw new Error('Trusted print asset hosts are not configured.');
  for (const asset of input.assets) {
    if (asset.pageCount !== input.pageCount || !asset.printArea ||
        typeof asset.url !== 'string' || !requireHTTPS(asset.url) ||
        !hosts.includes(new URL(asset.url).hostname.toLowerCase())) {
      throw new Error('Untrusted, expired, or inconsistent print file reference.');
    }
  }
}
function manifestMessage(uid: string, m: BookManifest): string {
  return JSON.stringify({
    uid, albumId: m.albumId, albumUpdatedAt: m.albumUpdatedAt,
    childID: m.childID, sku: m.sku, pageCount: m.pageCount,
    approvedBy: m.approvedBy, approvedAt: m.approvedAt,
    assets: m.assets.map(a => ({
      printArea: a.printArea, url: a.url, pageCount: a.pageCount,
      storagePath: a.storagePath || '', generation: a.generation || '',
    })),
  });
}
export function signApprovedManifest(uid: string, manifest: BookManifest): string {
  const secret = process.env.BOOK_MANIFEST_SIGNING_SECRET || '';
  if (secret.length < 32) throw new Error('Secure print approval signing is not configured.');
  return createHmac('sha256', secret).update(manifestMessage(uid, manifest)).digest('hex');
}
export function verifyApprovedManifest(uid: string, manifest: BookManifest): void {
  validateManifest(manifest);
  if (!manifest.signature || !/^[0-9a-f]{64}$/.test(manifest.signature) ||
      !timingSafeEqual(Buffer.from(manifest.signature, 'hex'),
        Buffer.from(signApprovedManifest(uid, manifest), 'hex'))) {
    throw new Error('The print manifest is not signed by the trusted server.');
  }
}
export async function verifySupplierQuote(manifest: BookManifest, countryCode: string): Promise<void> {
  if (!/^[A-Z]{2}$/.test(countryCode)) throw new Error('Invalid shipping destination.');
  const key = process.env.PRODIGI_API_KEY;
  if (!key) throw new Error('Prodigi credentials are missing.');
  const base = process.env.PRODIGI_ENVIRONMENT === 'production' ? 'https://api.prodigi.com' : 'https://api.sandbox.prodigi.com';
  const response = await fetch(base + '/v4.0/quotes', {
    method: 'POST', headers: { 'X-API-Key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      destinationCountryCode: countryCode,
      currencyCode: 'USD',
      items: [{ sku: manifest.sku, copies: 1, attributes: {}, assets: manifest.assets.map(a => ({ printArea: a.printArea, pageCount: a.pageCount })) }],
    }), cache: 'no-store', signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Prodigi cannot quote this book/destination.');
  const value = await response.json() as { quotes?: unknown[] };
  if (!Array.isArray(value.quotes) || value.quotes.length === 0) throw new Error('No Prodigi quote is available for this destination.');
}
export async function createStripeSession(order: BookOrder, email: string, origin: string): Promise<{ id: string; url: string }> {
  if (!checkoutEnabled()) throw new Error('Photo book checkout is not available yet.');
  const allowed = (process.env.STRIPE_CHECKOUT_ORIGIN || '').replace(/\/$/, '');
  if (!requireHTTPS(allowed) || allowed !== origin) throw new Error('Checkout origin is not configured.');
  const form = new URLSearchParams({
    ui_mode: 'hosted_page', mode: 'payment', billing_address_collection: 'auto',
    'phone_number_collection[enabled]': 'false', 'automatic_tax[enabled]': 'false',
    allow_promotion_codes: 'false', submit_type: 'auto',
    integration_identifier: 'hosted_mobile_app_0001', origin_context: 'mobile_app',
    success_url: allowed + '/family?view=albums&checkout=success&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: allowed + '/family?view=albums&checkout=cancel',
    'line_items[0][price]': order.productPriceId, 'line_items[0][quantity]': '1',
    'line_items[1][price]': order.shippingPriceId, 'line_items[1][quantity]': '1',
    'shipping_address_collection[allowed_countries][0]': order.countryCode,
    'metadata[bookOrderId]': order.id, 'metadata[ownerUid]': order.uid,
    client_reference_id: order.id, customer_creation: 'always',
  });
  if (email) form.set('customer_email', email);
  const response = await stripeFetch('checkout/sessions', {
    method: 'POST', body: form,
    headers: { 'Idempotency-Key': 'boodoo-book-' + order.id },
  });
  if (!response.ok) throw new Error('Stripe Checkout Session creation failed.');
  const session = await response.json() as { id?: string; url?: string };
  if (!session.id?.startsWith('cs_') || !session.url?.startsWith('https://checkout.stripe.com/')) {
    throw new Error('Invalid Stripe Checkout response.');
  }
  return { id: session.id, url: session.url };
}
export function verifyStripeEvent(raw: string, header: string | null, secret: string): { id: string; type: string; data: { object: Record<string, unknown> } } {
  if (!header || !secret) throw new Error('Missing Stripe signature.');
  const parts = header.split(',').map(x => x.trim().split('='));
  const timestamp = parts.find(x => x[0] === 't')?.[1];
  const signatures = parts.filter(x => x[0] === 'v1').map(x => x[1]);
  if (!timestamp || !/^\d+$/.test(timestamp) || signatures.length === 0 ||
      Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) throw new Error('Expired or invalid Stripe signature.');
  const expected = createHmac('sha256', secret).update(timestamp + '.' + raw).digest('hex');
  if (!signatures.some(s => /^[a-f0-9]{64}$/.test(s) &&
      timingSafeEqual(Buffer.from(s, 'hex'), Buffer.from(expected, 'hex')))) {
    throw new Error('Invalid Stripe signature.');
  }
  const event = JSON.parse(raw) as { id: string; type: string; data: { object: Record<string, unknown> } };
  if (!event.id || !event.type || !event.data?.object) throw new Error('Malformed Stripe event.');
  return event;
}
function mapRecipient(session: Record<string, unknown>, country: string): ProdigiRecipient {
  const collected = session.collected_information as { shipping_details?: { name?: string; address?: Record<string, string> } } | undefined;
  const shipping = collected?.shipping_details ||
    session.shipping_details as { name?: string; address?: Record<string, string> } | undefined;
  const address = shipping?.address;
  if (!shipping?.name || !address || address.country !== country ||
      !address.line1 || !address.postal_code || !address.city) throw new Error('Shipping address missing or mismatched.');
  const customer = session.customer_details as { email?: string } | undefined;
  return {
    name: shipping.name.slice(0, 150),
    ...(customer?.email ? { email: customer.email } : {}),
    address: { line1: address.line1, ...(address.line2 ? { line2: address.line2 } : {}),
      postalOrZipCode: address.postal_code, countryCode: address.country, townOrCity: address.city,
      ...(address.state ? { stateOrCounty: address.state } : {}) },
  };
}
export async function applyPaidSession(order: BookOrder, session: Record<string, unknown>): Promise<BookOrder> {
  if (session.id !== order.stripeSessionId || session.client_reference_id !== order.id ||
      session.payment_status !== 'paid' || session.mode !== 'payment' ||
      session.currency !== order.currency || session.amount_total !== order.amountTotal ||
      (session.metadata as Record<string, string> | undefined)?.bookOrderId !== order.id ||
      (session.metadata as Record<string, string> | undefined)?.ownerUid !== order.uid) {
    throw new Error('Payment did not match the authorized order.');
  }
  return { ...order, status: 'paid', recipient: mapRecipient(session, order.countryCode), updatedAt: new Date().toISOString() };
}
export async function submitProdigi(order: BookOrder): Promise<{ id: string; stage: string }> {
  if (process.env.PRINT_FULFILLMENT_ENABLED !== 'true') throw new Error('Production fulfillment is not enabled.');
  if (!order.recipient) throw new Error('No verified Stripe delivery address.');
  verifyApprovedManifest(order.uid, order.manifest);
  if (process.env.PRODIGI_ENVIRONMENT === 'production' &&
      (process.env.BOOK_COMMERCE_LIVE_ENABLED !== 'true' || !stripeKey().startsWith('sk_live_'))) {
    throw new Error('Live Prodigi requires separately enabled live commerce.');
  }
  const key = process.env.PRODIGI_API_KEY;
  if (!key) throw new Error('Prodigi key is missing.');
  const base = process.env.PRODIGI_ENVIRONMENT === 'production' ? 'https://api.prodigi.com' : 'https://api.sandbox.prodigi.com';
  const callbackRoot = process.env.PRODIGI_CALLBACK_URL;
  const callbackSecret = process.env.PRODIGI_CALLBACK_SECRET;
  if (!callbackRoot || !callbackSecret || !requireHTTPS(callbackRoot) || callbackSecret.length < 24) {
    throw new Error('Authenticated Prodigi delivery callbacks are not configured.');
  }
  const callbackURL = new URL(callbackRoot);
  callbackURL.searchParams.set('token', callbackSecret);
  const response = await fetch(base + '/v4.0/orders', {
    method: 'POST',
    headers: { 'X-API-Key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idempotencyKey: order.id,
      merchantReference: order.uid + ':' + order.id,
      callbackUrl: callbackURL.toString(),
      shippingMethod: 'Standard',
      recipient: order.recipient,
      items: [{ sku: order.manifest.sku, copies: 1, sizing: 'fitPrintArea',
        assets: order.manifest.assets.map(a => ({ printArea: a.printArea,
          url: a.storagePath && a.generation ? signedProofUrl(a.storagePath, a.generation) : a.url,
          pageCount: a.pageCount })) }],
    }), cache: 'no-store', signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('Prodigi order submission failed.');
  const result = await response.json() as { order?: { id?: string; status?: { stage?: string } }; outcome?: string };
  if (!result.order?.id?.startsWith('ord_') || !['created', 'onhold', 'createdwithissues', 'alreadyexists'].includes((result.outcome || '').toLowerCase())) {
    throw new Error('Prodigi order result requires investigation.');
  }
  return { id: result.order.id, stage: result.order.status?.stage || 'Submitted' };
}
export type ProdigiOrderDetails = { id: string; merchantReference: string; status?: { stage?: string }; shipments?: Array<{ tracking?: { url?: string; number?: string } }> };
export async function getProdigiDetails(id: string): Promise<ProdigiOrderDetails> {
  if (!/^ord_[a-zA-Z0-9_-]+$/.test(id) || !process.env.PRODIGI_API_KEY) throw new Error('Supplier order unavailable.');
  const base = process.env.PRODIGI_ENVIRONMENT === 'production' ? 'https://api.prodigi.com' : 'https://api.sandbox.prodigi.com';
  const response = await fetch(base + '/v4.0/orders/' + encodeURIComponent(id), {
    headers: { 'X-API-Key': process.env.PRODIGI_API_KEY }, cache: 'no-store', signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error('Could not retrieve supplier order.');
  const data = await response.json() as { order?: ProdigiOrderDetails };
  if (data.order?.id !== id) throw new Error('Unexpected supplier order response.');
  return data.order;
}
export function mergeProdigiDetails(order: BookOrder, details: ProdigiOrderDetails): BookOrder {
  if (order.prodigiId !== details.id || details.merchantReference !== order.uid + ':' + order.id) {
    throw new Error('Supplier order does not match the paid customer.');
  }
  const tracking = (details.shipments || []).flatMap(s => s.tracking ? [{
    ...(s.tracking.url?.startsWith('https://') ? { url: s.tracking.url } : {}),
    ...(s.tracking.number ? { number: s.tracking.number } : {}),
  }] : []);
  return { ...order, prodigiStage: details.status?.stage || order.prodigiStage,
    tracking, updatedAt: new Date().toISOString() };
}
export async function refreshProdigi(order: BookOrder): Promise<BookOrder> {
  if (!order.prodigiId) return order;
  return mergeProdigiDetails(order, await getProdigiDetails(order.prodigiId));
}
export async function runFulfillment(uid: string, id: string): Promise<void> {
  const path = orderPath(uid, id);
  const stored = await readRecord<BookOrder>(path);
  if (!stored || !['paid', 'fulfillment_error'].includes(stored.data.status)) return;
  const staleSubmission = stored.data.fulfillmentState === 'submitting' &&
    Date.now() - Date.parse(stored.data.updatedAt) > 10 * 60 * 1000;
  if (!['not_started', 'error'].includes(stored.data.fulfillmentState) && !staleSubmission) return;
  const submitting: BookOrder = {
    ...stored.data, status: 'paid', fulfillmentState: 'submitting', updatedAt: new Date().toISOString(),
  };
  await replaceRecord(path, submitting, stored.updateTime);
  try {
    const result = await submitProdigi(submitting);
    const current = await readRecord<BookOrder>(path);
    if (current && current.data.fulfillmentState === 'submitting') {
      await replaceRecord(path, {
        ...current.data, status: 'sent_to_print', fulfillmentState: 'submitted',
        prodigiId: result.id, prodigiStage: result.stage, updatedAt: new Date().toISOString(),
      }, current.updateTime);
    }
  } catch {
    const current = await readRecord<BookOrder>(path);
    if (current && current.data.fulfillmentState === 'submitting') {
      await replaceRecord(path, {
        ...current.data, status: 'fulfillment_error', fulfillmentState: 'error',
        lastError: 'Printing requires administrator review or retry.', updatedAt: new Date().toISOString(),
      }, current.updateTime);
    }
  }
}

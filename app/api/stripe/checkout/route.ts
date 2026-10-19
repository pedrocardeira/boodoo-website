import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Stripe Checkout is deliberately disabled until print pricing, order tracking,
// fulfillment and payment confirmation have been completed.
function isConfiguredUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !['example.com', 'www.example.com'].includes(url.hostname);
  } catch {
    return false;
  }
}

export async function POST() {
  if (process.env.STRIPE_CHECKOUT_ENABLED !== 'true') {
    return NextResponse.json({ error: 'Photo book checkout is not available yet.' }, { status: 503 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_BOOK_PRICE_ID;
  const successUrl = process.env.STRIPE_SUCCESS_URL;
  const cancelUrl = process.env.STRIPE_CANCEL_URL;

  if (!secret || !price || !price.startsWith('price_') || price === 'price_...' ||
      !isConfiguredUrl(successUrl) || !isConfiguredUrl(cancelUrl)) {
    return NextResponse.json({ error: 'Photo book checkout is not configured.' }, { status: 503 });
  }

  // The HTTPS API is equivalent to stripe.checkout.sessions.create(), with no
  // new package dependency or changes to the existing pnpm lockfile.
  // Payment mode is for a one-time physical book, not BooDoo Pro subscriptions.
  const form = new URLSearchParams({
    ui_mode: 'hosted_page',
    mode: 'payment',
    billing_address_collection: 'auto',
    'phone_number_collection[enabled]': 'false',
    'automatic_tax[enabled]': 'false',
    allow_promotion_codes: 'false',
    submit_type: 'auto',
    integration_identifier: 'hosted_mobile_app_0001',
    origin_context: 'mobile_app',
    success_url: successUrl,
    cancel_url: cancelUrl,
    'line_items[0][price]': price,
    'line_items[0][quantity]': '1',
  });
  // Do not send payment_method_collection in one-time payment mode.

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + secret,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
      cache: 'no-store',
    });

    if (!response.ok) {
      // Avoid sending Stripe error details, keys or request data to clients.
      return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 502 });
    }

    const session = (await response.json()) as { url?: string };
    if (!session.url || !session.url.startsWith('https://checkout.stripe.com/')) {
      return NextResponse.json({ error: 'Stripe did not return a checkout URL.' }, { status: 502 });
    }

    const redirect = NextResponse.redirect(session.url, 303);
    redirect.headers.set('Cache-Control', 'no-store');
    return redirect;
  } catch {
    return NextResponse.json({ error: 'Unable to contact checkout.' }, { status: 502 });
  }
}

# Stripe Checkout integration — BooDoo photo books

## Status

**Implemented in code, deliberately disabled. Not live or ready to take real payments.**
The Next.js server endpoint `POST /api/stripe/checkout` creates a Stripe-hosted Checkout Session for **one-time physical photo-book payments** only. It uses Stripe's HTTPS Checkout Sessions API directly (equivalent to the server SDK's `stripe.checkout.sessions.create`) so no new dependency, framework or lockfile changes are needed.

No customer-facing buy button, fulfillment webhook or Prodigi order submission has been connected. BooDoo Pro recurring iOS subscriptions remain on Apple In-App Purchase, not this endpoint.

## Values to Replace

**Files containing placeholder/unset values:**
- [.env.example](.env.example)
- [app/api/stripe/checkout/route.ts](app/api/stripe/checkout/route.ts) (reads the deployment environment, does not embed secrets)

| Field | Current value | What to set |
|---|---|---|
| `STRIPE_CHECKOUT_ENABLED` | `false` | **Keep false** until payment-to-print fulfillment and safeguards are complete. |
| `STRIPE_SECRET_KEY` | empty | Use an appropriately scoped Stripe secret key, test first. Configure as a protected server secret; never use `NEXT_PUBLIC_` or commit actual credentials. |
| `STRIPE_BOOK_PRICE_ID` / `line_items[0][price]` | empty | Real, active **one-time** Stripe Price ID `price_...` matching the chosen physical book and its actual retail price/currency. The account had no live prices when checked. Do not invent the price. |
| `STRIPE_SUCCESS_URL` / `success_url` | empty | Real absolute HTTPS BooDoo success page; optionally retain `{CHECKOUT_SESSION_ID}` template. Success redirect alone must **not** confirm an order. |
| `STRIPE_CANCEL_URL` / `cancel_url` | empty | Real absolute HTTPS BooDoo return/cancel page. |
| `STRIPE_WEBHOOK_SECRET` | empty | Add after implementing a Stripe signed webhook and registering the endpoint. Not currently used. |

`mode` is `payment` because physical books are one-time charges (not subscriptions). The API currently assumes **one book at a fixed Stripe price and quantity 1**. It is NOT dynamic for pages, formats, country, taxes or shipping. A real print order must have server-owned pricing, an approved draft and shipping quote; extend the integration for these before enabling.

## Configured Parameters

**Configured file:** [app/api/stripe/checkout/route.ts](app/api/stripe/checkout/route.ts)

| Parameter | Value |
|---|---|
| `ui_mode` | `hosted_page` |
| `mode` | `payment` |
| `billing_address_collection` | `auto` |
| `phone_number_collection.enabled` | `false` |
| `automatic_tax.enabled` | `false` |
| `allow_promotion_codes` | `false` |
| `submit_type` | `auto` |
| `integration_identifier` | `hosted_mobile_app_0001` |
| `origin_context` | `mobile_app` |
| `line_items[0][quantity]` | `1` |

No `payment_method_collection` is set for one-time payments; this follows the checkout instructions. The endpoint uses Stripe's latest HTTPS endpoint directly rather than a version-pinned SDK, so there is no SDK `ui_mode` compatibility requirement. If migrating to a Node Stripe SDK later, confirm the SDK's `hosted_page` support.

## Setup and next steps

1. **Set real products/prices** in Stripe (test first), decide book sizes, page-count-dependent pricing, currency and margins. Use the correct Price IDs and verify shipping costs and tax obligations. Stripe Tax is currently **off**, as configured in Checkout Studio; do not presume this is a tax-compliant worldwide checkout.
2. **Finish order readiness gates**: authenticated user and authorized child/album, immutable approved book revision, correct page count, printable full-resolution output with bleed and safe zones, validated destination, delivery fee and server-calculated grand total. Never trust client price, order ID or user-supplied fulfillment data.
3. **Implement durable order records and webhook** verifying Stripe signatures and expected session amount/currency/order reference. Handle asynchronous success/failure/refund paths, replay and idempotency. Fulfill only after verified payment, and submit approved print files to Prodigi Live exactly once using a stable idempotency key. Do not use Prodigi sandbox quotes for real orders.
4. **Build pages and UI**: create real payment success/cancel routes, integrate from the authenticated album checkout in the web/iOS flow (subject to App Store requirements), order history, support/refund and shipping status. Do not add a public buy button until these requirements are met.
5. **Configure hosting secrets** from [.env.example](.env.example), including Stripe test keys and HTTPS URLs, in your Vercel server environment; keep `STRIPE_CHECKOUT_ENABLED=false` in production. Confirm no Stripe private keys appear in browser code or logs.
6. **Test** the endpoint with test credentials and the Stripe test card `4242 4242 4242 4242` using a future expiry and any CVC. Test declined payments, cancel/return, wrong prices, missing settings, duplicate/replayed webhooks and network failures. No successful end-to-end Checkout test has been run yet.
7. Once the full verified order pipeline is reviewed and proven in test mode, plan controlled production activation. Only then set `STRIPE_CHECKOUT_ENABLED=true`.

### Files changed

- `app/api/stripe/checkout/route.ts` — a minimal Next.js server-side checkout endpoint; fails closed when not configured.
- `.env.example` — documents deployment variables.
- `STRIPE_INTEGRATION_TODO.md` — this setup checklist.

### How it works

A future approved-order UI posts to the same-origin `/api/stripe/checkout` endpoint. While disabled, it returns HTTP 503 without contacting Stripe. When explicitly enabled and correctly configured, the server requests a Stripe-hosted payment session using a predefined Price ID and redirects HTTP 303 to the Stripe Checkout URL. The payment **does not** yet create a BooDoo order or a Prodigi print job. A browser redirect alone is not evidence of payment.

### Resources

- https://docs.stripe.com/payments/checkout
- https://docs.stripe.com/webhooks
- https://docs.stripe.com/testing
- https://docs.stripe.com/mcp
- https://support.stripe.com

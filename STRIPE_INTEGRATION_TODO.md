# BooDoo — Stripe Checkout, order tracking and Prodigi printing

## Status: code implemented, launch disabled

The server-side payment-to-print workflow and the authenticated website ordering UI are committed to the root Next.js app. **Real purchasing remains disabled intentionally.** The connected Stripe live account had **zero configured prices** when checked on 19 October 2026. The current web album editor exports a **personal HTML preview**, not the actual supplier-quality PDF needed for printing. No Prodigi Live key, approved printer SKU/production artwork, tax/shipping prices or paid-order testing has been established in this repository.

**Never turn on any live commerce flags until the complete checklist below is executed.** This integration never changes BooDoo Pro iOS subscriptions, which continue via Apple IAP.

## Implemented files

- [app/api/stripe/checkout/route.ts](app/api/stripe/checkout/route.ts) — Firebase-authenticated checkout; verifies owner-family-child linkage, server-approved album revision, supplier quote, active one-time Stripe book + shipping Price IDs and payment environment. Creates a server-owned persistent order before Stripe Checkout. Sends only server-chosen prices.
- [app/api/stripe/webhook/route.ts](app/api/stripe/webhook/route.ts) — validates a raw Stripe webhook signature (HMAC-SHA256 + 5-minute timestamp tolerance), payment amount, currency, owner, order and session identity; transitions order statuses and starts print fulfillment only after verified payment.
- [app/api/print/orders/route.ts](app/api/print/orders/route.ts) — logged-in order history (without exposing family medical details, print URLs or shipping addresses), plus admin-only idempotent retries and supplier status refresh.
- [app/api/print/approve/route.ts](app/api/print/approve/route.ts) — admin-only approval of a print-ready PDF manifest bound to the current saved album revision and selected verified Prodigi SKU. **Approval is not a substitute for manually inspecting PDF page count, bleed, cover/spine and artwork.**
- [app/api/prodigi/webhook/route.ts](app/api/prodigi/webhook/route.ts) — shared-secret-authenticated supplier callback. Re-fetches canonical Prodigi order over a server-key connection and cross-checks its merchant reference before updating production/shipping/tracking state.
- [lib/server/commerce-store.ts](lib/server/commerce-store.ts) — server-only service account OAuth and Firestore REST storage (optimistic update-time conditions).
- [lib/server/book-commerce.ts](lib/server/book-commerce.ts) — one-time payment validation, Stripe session operations, Prodigi quote/order/lookup helpers, permanent Prodigi `idempotencyKey`, stalled order recovery.
- [components/v2/book-orders.tsx](components/v2/book-orders.tsx), [components/v2/album-studio.tsx](components/v2/album-studio.tsx), [components/v2/family-space.tsx](components/v2/family-space.tsx) — verified order history, print-stage links, optional buy button and non-misleading payment return notice.
- [.env.example](.env.example) — all environment flags/secrets (intentionally blank/false).
- This document — single source of truth for remaining launch steps.

## Values to configure

| Variable | Current value | Required action |
|---|---|---|
| `STRIPE_SECRET_KEY` | empty | Use a test key first; live key only after end-to-end testing. Add as a protected Vercel server environment variable, never in Git, browser or screenshots. |
| `STRIPE_BOOK_PRICE_ID` | empty | Create a real active **one-time** Stripe Price `price_...` for the approved physical photo-book size/type and currency. Do not make up amounts without Prodigi production and shipping landed costs. |
| `STRIPE_SHIPPING_PRICE_IDS_JSON` | `{}` | Configure country-to-one-time-shipping-Price mapping, e.g. `{"US":"price_REAL_ID"}`. Each amount must cover the approved service/country. Book and shipping Price must have the same currency and Stripe environment. |
| `STRIPE_CHECKOUT_ORIGIN` | `https://www.boodoo.app` | Confirm the exact HTTPS origin on which the server and family studio are deployed. |
| `STRIPE_WEBHOOK_SECRET` | empty | Register `https://www.boodoo.app/api/stripe/webhook` in the **matching Stripe environment** and store its `whsec_...` secret. Subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`. |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | empty | Store a dedicated minimal-privilege JSON service account for the existing Firestore project. Its `project_id` must equal `NEXT_PUBLIC_FIREBASE_PROJECT_ID`. Do not commit. |
| `PRINT_ADMIN_UIDS` | empty | Comma-separated trusted Firebase UIDs who may approve print files and retry failed orders. |
| `PRODIGI_API_KEY` | empty | Prodigi Sandbox key first, Live key only for approved production. |
| `PRODIGI_BOOK_SKU` | empty | Real validated Prodigi photo-book SKU matched to trim size, cover, binding and printed page-count rules. |
| `PRODIGI_ENVIRONMENT` | `sandbox` | Remain in Sandbox until samples, quotes and assets pass. |
| `PRINT_ASSET_HOSTS` | empty | Comma-separated exact approved HTTPS hosts where Prodigi can GET production-ready PDF files without cookies, e.g. a signed Google Cloud Storage object endpoint. Do not use demo/photos or personal HTML. Ensure link expiry survives print ingestion. |
| `BOOK_MANIFEST_SIGNING_SECRET` | empty | Generate 32+ random secret characters for HMAC-signed administrator approvals. Required for safe checkout and fulfillment. |
| `PRODIGI_CALLBACK_URL` | `https://www.boodoo.app/api/prodigi/webhook` | Confirm the deployed HTTPS path. |
| `PRODIGI_CALLBACK_SECRET` | empty | Generate at least 24 random characters and protect like a key. The adapter appends it to the per-order callback URL because Prodigi does not supply Stripe-style signed callbacks. Avoid exposing request URLs in logs. |
| `NEXT_PUBLIC_WEB_ALBUMS_ENABLED` | `false` | Deploy and test account-isolated Firestore/Storage rules, then enable real saved albums. No demo albums may purchase. |
| `NEXT_PUBLIC_BOOK_SHIPPING_COUNTRIES` | `US` | Comma-separated enabled countries, matching configured shipping prices. Only enable each after a verified destination and supplier quote. |
| `NEXT_PUBLIC_BOOK_CHECKOUT_ENABLED` | `false` | Only expose the order control after end-to-end staging passes. |
| `STRIPE_CHECKOUT_ENABLED` | `false` | Server-side master flag. Leave false until the final readiness check. |
| `PRINT_FULFILLMENT_ENABLED` | `false` | Enables actual Prodigi order submission after verified payment. No standalone Prodigi orders are created during quotes. |
| `BOOK_COMMERCE_LIVE_ENABLED` | `false` | Separate explicit authorization for **live** Stripe payments with **live** Prodigi fulfillment. |

**Checkout Studio settings applied:** `ui_mode=hosted_page`, `mode=payment` (physical goods, not subscription), `billing_address_collection=auto`, `phone_number_collection.enabled=false`, `automatic_tax.enabled=false`, `allow_promotion_codes=false`, `submit_type=auto`, `integration_identifier=hosted_mobile_app_0001`, `origin_context=mobile_app`. `payment_method_collection` is intentionally omitted for one-time payment mode. Redirects target the existing authenticated `/family?view=albums` page with a *pending-verification* message, not a paid-order assertion.

**Important tax warning:** automatic Stripe Tax is OFF because that was selected in Checkout Studio. Configure and review VAT/sales tax obligations before accepting payments internationally. Shipping is a separate pre-priced Stripe line item; country-specific rates must be approved, not inferred from a supplier production-cost quote.

## What actually happens

1. Authenticated user creates and **saves** a real album draft under `users/{uid}/webAlbums/{albumId}`. Client changes after approval invalidate that approval by `updatedAt`.
2. Staff render and quality-check a **real press-ready, full-resolution PDF**, with physical size, bleed, safe areas and validated page count for the chosen SKU. Website's HTML preview cannot be used for this. Store the PDFs at privately managed, short-lived-signed or otherwise access-controlled HTTPS URLs that Prodigi can download. Maintain least-privilege download access.
3. Admin approves and cryptographically signs the exact PDF references using `POST /api/print/approve` with their Firebase Bearer token. Body: `{"ownerUid":"UID","albumId":"UUID","sku":"REAL_PRODIGI_SKU","pageCount":24,"assets":[{"printArea":"default","url":"https://trusted-host/.../print.pdf","pageCount":24}]}`. Actual supported `printArea` values must match the chosen Prodigi SKU. This action is for a human-reviewed print file, not automatic proof of PDF validity.
4. After all flags/secrets/prices are ready, the studio allows the parent to pick a shipping country and order. The server verifies album, family membership, immutable manifest, product + shipping prices and a successful supplier quote. Checkout limits the Stripe-collected shipping address to that country.
5. Stripe Checkout collects payment on the hosted Stripe page. A signed webhook confirms payment and exact amount/currency/order/session. An authenticated persistent order is updated. A browser success redirect does **not** trigger printing.
6. Verified paid order is submitted to Prodigi with a permanent `idempotencyKey` and owner:order merchant reference. The supplier may produce/ship immediately in Live. Server records the supplier ID and handles retries safely.
7. Prodigi stage-change callback authenticates via configured secret, then server refetches the supplier order and updates status/tracking. Customer views it in **Family → Albums → Your printed book orders**. Administrator can run `POST /api/print/orders` with `{"uid":"UID","orderId":"UUID","action":"retry-fulfillment"}` or `"refresh-status"`.

## Required before taking real money

- [ ] **Set retail prices:** inspect real Prodigi SKU quote by format/page count and destination; approve currency, production + shipping charges, margin, VAT/sales tax and refunds. Create book and shipping one-time Prices in Stripe; configure the real IDs. Current implementation uses one fixed SKU and one book Price; additional sizes/page bands require approved per-variant pricing and selection logic before marketing multiple versions.
- [ ] **Complete real PDF export:** render book pages and cover/spine/bleed in the specific Prodigi product format. Test file resolution, cover, pagination, PDF accessibility and exact print areas with Prodigi Sandbox and physical samples. The current web HTML exporter is for personal preview only.
- [ ] **Production persistence:** configure server service account, manifest signing secret, and protected Firestore write rules; deploy/test webAlbum and asset rules described in [docs/WEB_ALBUM_RULES.md](docs/WEB_ALBUM_RULES.md). No direct customer read/write access to `bookOrders` or `printManifests`; test overlapping rules against [docs/WEB_COMMERCE_RULES.md](docs/WEB_COMMERCE_RULES.md). Test album revisions after approvals, denied household memberships, retries and every failed state.
- [ ] **Currency and country support:** choose shipping country rates, tax treatment, fulfillment shippingMethod and valid SKU globally. Verify with supplier before adding destinations to `NEXT_PUBLIC_BOOK_SHIPPING_COUNTRIES`.
- [ ] **Webhooks:** register correct test/live Stripe webhook secrets and HTTPS Prodigi callback; verify signatures, replay behavior, async payments, failed/cancelled payments and duplicate callbacks. Test status retries after network failures and Prodigi `alreadyExists` responses. Review paid but failed fulfillment orders manually; refund through Stripe if they cannot be fulfilled.
- [ ] **Security and privacy:** test consent, customer privacy notice for transfer of customer print data to Prodigi, access boundaries, log redaction, deletion policies, sensitive family photos, invoice and support workflows.
- [ ] **Run tests/build:** use Node 22+ and `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm build`, and then perform actual Checkout and Prodigi Sandbox order end-to-end. No successful deployment or paid-order test has been performed by this implementation.
- [ ] **Only after tests:** turn on server feature flags and optionally the UI flag. For live charges, require `BOOK_COMMERCE_LIVE_ENABLED=true`, live Stripe key, Prodigi environment production, real approved print manifests and verified fulfillment.

## Failure and recovery notes

- Missing configuration, an unsigned/forged manifest, or an unapproved/changed album **fails closed** before checkout, preventing money collection.
- A verified payment with a temporarily failed supplier request stays recorded as `fulfillment_error`; an administrator can investigate/retry. Prodigi deduplicates the same permanent `idempotencyKey`. A stuck `submitting` order becomes retryable after 10 minutes.
- Merchant reference always associates the Prodigi order with the internal customer and order. Supplier callbacks are not trusted for their claimed shipping status until confirmed by direct Prodigi lookup.
- No actual payment, Stripe Price creation, Prodigi Live order, print-ready PDF generation or production activation has been performed.

## Official references

- https://docs.stripe.com/payments/checkout
- https://docs.stripe.com/webhooks
- https://docs.stripe.com/tax
- https://www.prodigi.com/print-api/docs/reference/
- https://support.stripe.com

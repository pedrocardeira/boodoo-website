# BooDoo photo books — PDF proofs, Stripe Checkout and Prodigi

## Current state — implementation present, sales disabled

**Do not enable real payments yet.** The repository includes an authenticated checkout,
Stripe webhook verification, persistent order records, Prodigi Sandbox/Live adapters
with idempotency, delivery tracking, and a new 300dpi PDF **proof** export.
This is not a certified PDF/X-4 production pipeline and has not passed a complete
paid-order-to-printer test. The connected live Stripe account had **no active
one-time prices** when checked on October 19, 2026. Existing Apple BooDoo Pro
subscriptions are unaffected.

The proof export is designed around one **210 × 210 mm square hardcover**.
This is only a preliminary format, not authorization to use any arbitrary Prodigi SKU.
The final SKU, binding, spine artwork, page count and print areas must be confirmed
against Prodigi's production specifications and a physical sample.

## Completed code

- [lib/v2/print-pdf.ts](lib/v2/print-pdf.ts): zero-dependency PDF 1.4 export.
  Renders complete pages as high-resolution RGB JPEGs at 300dpi; front cover first,
  individual memory pages, back cover last; 10mm safe margins for text;
  rejects insufficient image resolution and clipped narrative content;
  adds a meaningful chapter summary only to balance odd page counts, never blank filler.
  **Not yet validated as PDF/X-4 or for a specific print lab.**
- [components/v2/album-studio.tsx](components/v2/album-studio.tsx):
  **Generate print PDF** download, progress indicator, and private Firebase Storage
  proof upload for a saved cloud album. An unsaved/demo draft can download a local
  proof but cannot be approved/ordered.
- [lib/server/gcs-print-proof.ts](lib/server/gcs-print-proof.ts):
  validates private proof metadata and generates V4 signed URLs pinned to an
  immutable Cloud Storage object generation. Supplier URLs are refreshed on
  submission, so customer proof approval need not depend on a previously expired link.
- [app/api/print/proof-inspect/route.ts](app/api/print/proof-inspect/route.ts):
  administrator-only endpoint returning a **15-minute** private PDF review link.
- [app/api/print/approve/route.ts](app/api/print/approve/route.ts):
  administrator signs an explicitly reviewed proof and its saved album revision.
  No arbitrary customer-provided PDF can bypass this signing step.
- [app/api/print/pricing-preview/route.ts](app/api/print/pricing-preview/route.ts):
  administrator-only **real Prodigi Standard quote** and margin-based selling
  price suggestion for a verified SKU, page count and shipping country.
- [lib/server/book-commerce.ts](lib/server/book-commerce.ts):
  Stripe active one-time Price validation, supplier landed-cost checks, server-approved
  minimum gross-margin enforcement, payment signature verification, and Prodigi
  order submission using stable idempotency keys.
- [app/api/stripe/checkout/route.ts](app/api/stripe/checkout/route.ts):
  authenticated and fail-closed, requires saved approved album, matching signature,
  verified household, supplier quote, real book and country shipping Stripe Price IDs.
- [app/api/stripe/webhook/route.ts](app/api/stripe/webhook/route.ts):
  verified paid-session webhook updates order before any print submission.
- [app/api/prodigi/webhook/route.ts](app/api/prodigi/webhook/route.ts):
  authenticated Prodigi callbacks; retrieves canonical supplier order and
  verifies merchant reference before saving shipping status.
- [app/api/print/orders/route.ts](app/api/print/orders/route.ts),
  [components/v2/book-orders.tsx](components/v2/book-orders.tsx):
  per-user order history, tracking and administrator repair/retry operations.
- [docs/WEB_ALBUM_RULES.md](docs/WEB_ALBUM_RULES.md),
  [docs/WEB_COMMERCE_RULES.md](docs/WEB_COMMERCE_RULES.md):
  un-deployed proposed Firestore/Storage rules for private proofs and immutable orders.

## Server configuration — leave payment switches off until everything passes

Copy the variable names from [.env.example](.env.example) into protected Vercel
environment variables. Do not put private credentials in GitHub, chat, client
source or `NEXT_PUBLIC_` variables.

| Variable | Requirement |
| --- | --- |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Dedicated service-account JSON with minimum Firestore and Cloud Storage object-reader permissions. |
| `NEXT_PUBLIC_WEB_ALBUMS_ENABLED` | `true` only **after** deploying and testing additive Firebase rules. |
| `PRINT_PROOF_BUCKET` | Private Firebase/GCS bucket for immutable PDF proof objects; defaults to public Firebase bucket configuration. |
| `PRINT_ASSET_HOSTS` | Include only `storage.googleapis.com` for the supported proof signed URLs. |
| `BOOK_MANIFEST_SIGNING_SECRET` | Random server-only secret, minimum 32 characters. |
| `PRINT_ADMIN_UIDS` | Comma-separated trusted Firebase UIDs for inspection, approval and order repair. |
| `PRODIGI_API_KEY` | Sandbox API key first; Live key only after print sample sign-off. |
| `PRODIGI_BOOK_SKU` | Actual verified 210mm square hardcover SKU with confirmed `default` and spine requirements. |
| `PRODIGI_ENVIRONMENT` | `sandbox` for tests, `production` only for paid live books. |
| `STRIPE_SECRET_KEY` | Test key for staging, matching live key for production. |
| `STRIPE_BOOK_PRICE_ID` | Active one-time Stripe Price ID. It must match chosen format and valid page band. |
| `STRIPE_SHIPPING_PRICE_IDS_JSON` | Country → active one-time shipping Price ID map, e.g. `{"US":"price_YOUR_REAL_ID"}`. |
| `BOOK_MIN_GROSS_MARGIN_PERCENT` | Merchant-approved percentage **0 to below 80**. Both Stripe prices must cover the live Prodigi supplier quote and this margin. Tax, Stripe fees, refunds and overhead are not included. |
| `STRIPE_CHECKOUT_ORIGIN` | Confirm actual HTTPS deployment origin. |
| `STRIPE_WEBHOOK_SECRET` | Registered Stripe webhook signature secret for the correct environment. |
| `PRODIGI_CALLBACK_URL` | `https://www.boodoo.app/api/prodigi/webhook` if that is the production origin. |
| `PRODIGI_CALLBACK_SECRET` | 24+ random characters, kept private, used as the callback token. |
| `NEXT_PUBLIC_BOOK_SHIPPING_COUNTRIES` | Country codes supported by verified supplier quote and Stripe shipping prices. |
| `NEXT_PUBLIC_BOOK_CHECKOUT_ENABLED` | `false` until ready to display order button. |
| `STRIPE_CHECKOUT_ENABLED` | `false` until end-to-end tests and approved retail amounts. |
| `PRINT_FULFILLMENT_ENABLED` | `false` until final supplier artwork and Sandbox fulfillment are verified. |
| `BOOK_COMMERCE_LIVE_ENABLED` | `false` until explicit approval for real charges AND real Prodigi production. |

**Checkout Studio parameters kept:** `ui_mode=hosted_page`, `mode=payment`,
`billing_address_collection=auto`, `phone_number_collection.enabled=false`,
`automatic_tax.enabled=false`, `allow_promotion_codes=false`,
`submit_type=auto`, `integration_identifier=hosted_mobile_app_0001`,
`origin_context=mobile_app`. Do not add `payment_method_collection` in
one-time payment mode.

## Admin review workflow

1. Parent signs in, saves a cloud album, and chooses **Generate print PDF**. This
   downloads a review PDF and (once Firebase Storage rules are deployed) uploads
   it privately to `users/{uid}/webAlbumProofs/{albumId}/{proofId}.pdf`.
2. Inspector obtains a short-lived download link from
   `POST /api/print/proof-inspect` with an administrator Firebase Bearer token
   and body `{"ownerUid":"UID","albumId":"ALBUM_ID","storagePath":"users/UID/webAlbumProofs/ALBUM_ID/PROOF_ID.pdf"}`.
3. Inspector checks actual PDF dimensions, total file page count vs the Prodigi
   `pageCount` specification, image resolution, contrast and typography,
   spine, country-dependent product variant and missing content. The current PDF
   proof uses RGB raster pages and **does not declare PDF/X-4 certification**.
   Ask Prodigi to accept/qualify this artwork before production.
4. After confirming the supplier test, administrator calls
   `POST /api/print/approve` with the same authenticated owner/album/proof,
   plus `{"sku":"VERIFIED_SKU","pageCount":26,"storagePath":"...pdf","printArea":"default","preflightConfirmed":true}`
   (example count only: use the **actual verified** PDF count). The server binds
   its HMAC signature to owner, child, album revision, PDF object generation,
   page count, SKU and signed reference.
5. Once real prices and delivery countries exist, server checks the **Standard**
   shipping quote and configured gross margin, creates a Stripe-hosted session,
   and stores the order. Webhook verifies payment before an idempotent Prodigi
   submission. Prodigi callbacks update tracking.

## Pricing workflow

The administrative `POST /api/print/pricing-preview` accepts
`{"countryCode":"US","pageCount":26}` with a Firebase admin Bearer token.
It requests a **real** Prodigi Standard quote (production + shipping in USD).
With `BOOK_MIN_GROSS_MARGIN_PERCENT` configured, it returns a minimum
suggested retail total and split between book and shipping, **before tax,
Stripe fees or refund reserve**. Review and approve actual consumer prices,
then create two active **one-time** Stripe Prices per supported country in the
matching Stripe environment. Never assume the suggestion itself is a final
customer selling price.

## Blocking steps before taking real money

- [ ] Confirm the exact Prodigi SKU(s), binding/page count rules, **spine
  artwork requirement**, final print area dimensions, PDF/X-4 acceptance and
  physical print sample. Current PDF is a *proof*, not a qualified press file.
- [ ] Set up server credentials and Firebase proof upload rules; verify genuine
  household authentication and private photo CORS in a real account.
- [ ] Query actual supplier prices for relevant page counts and destinations.
  Approve format, retail pricing, country shipping fees, margin, tax and refunds,
  then create Stripe book + shipping prices. No live Stripe prices were present.
- [ ] Configure and test webhook subscriptions, signature verification, duplicate
  events, payment failures, customer cancellations, supplier error states,
  refunds, and actual shipping status.
- [ ] Run Node 22+ `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm build`
  and a **real Stripe test-mode → Prodigi Sandbox** journey, followed by
  physical sample verification. Vercel deploy successes are not proof of commerce success.
- [ ] Review customers' privacy notice for sending family photos and recipient
  shipping details to Prodigi and set retention and deletion rules.
- [ ] Only after validation, explicitly turn on all necessary flags in staging,
  then separately authorize production. Do **not** enable Stripe Checkout
  without working signed approval and production fulfillment.

## Official requirements

- https://support.prodigi.com/hc/en-us/articles/17150417510940-Hardcover-photo-books-File-set-up-guidelines
- https://www.prodigi.com/blog/photo-books-technical-guide/
- https://www.prodigi.com/print-api/docs/reference/
- https://docs.cloud.google.com/storage/docs/access-control/signing-urls-manually
- https://docs.stripe.com/payments/checkout
- https://docs.stripe.com/webhooks
- https://docs.stripe.com/tax

# Boodoo website v2

## Source and design

Reviewed Boodoo iOS main through commit `1942d456ed313cc6c38b086655a4ff20e5202767` on October 13, 2026, plus the current Firebase sync service, Firestore rules, profile model, book styles/periods, and complete ContentView blob. Latest additions include Health Stories with planned medication and appointments, readable Ask BooDoo Markdown, development history with undo, and the 8-memory/3-photo/3-day book gate.

Website baseline: `pedrocardeira/boodoo-website`, main `78b2fda`. The repository previously contained an incomplete root app and a fuller `boodoo-github-source` app. Version 2 uses the root app; the nested deployment directory is synchronized before delivery for compatibility. Existing SEO and reference pages are retained.

The user's screenshots define the design: charcoal surfaces, large rounded panels, gold selection states, strong rounded headings, and photo backgrounds. All v2 photographs and app screenshots come from the user's supplied files. HEIC photos were converted to JPEG and optimized; location/camera metadata was omitted from web derivatives. Originals are untouched. No stock or generated photographs are included.

## Implemented

- Responsive marketing homepage, memory books page, and sourced competitor comparison.
- Same-account Firebase email/password authentication, password reset, and session persistence.
- User-to-household mapping and membership checks, child switching, read-only daily/care/growth/memory views, record export, and explicit loading/error/empty states.
- Isolated demo mode with synthetic care records and supplied photos.
- Album drafts, four styles aligned with iOS, book periods and custom dates, page captions/order, photo upload, saved demo drafts, conditional cloud persistence, personal HTML preview export, JSON backup, preliminary image-resolution checks, and iOS-aligned readiness gate.
- Server-only Prodigi quote adapter and admin-only evaluation endpoint. Defaults to sandbox and USD/US. It never submits an order or payment.

## Not live / required setup

1. Register or obtain a Firebase Web app configuration for the existing Boodoo project. Set the public configuration variables from `.env.example` in the hosting environment. Do not use the iOS app ID as a web app ID. Add the deployed domain where required by Firebase Auth and confirm API-key restrictions.
2. Validate login with an existing registered account whose iOS app has written `users/{uid}.householdID`. Test owner and caregiver accounts, sign-out, expired sessions, denied membership, and two-account isolation. No real account credentials were provided for this test.
3. Merge/test/deploy the additive album rules in `WEB_ALBUM_RULES.md`, configure Storage CORS, and enable cloud albums. The website has not deployed Firebase rules. Cloud album drafts are separate from current iOS-generated drafts.
4. Prodigi is already integrated by the iOS project through an authenticated Firebase sandbox quote function. The website now reuses it via `/api/print/sandbox-quote`; no new supplier key is needed in Vercel for this path. Verify a real signed-in web session, final product SKU and production specifications before checkout. The older admin-only `/api/print/quote` evaluator remains separate.
5. Production commerce still needs original-resolution assets, supplier-specific PDFs/bleed/spine/page rules, authenticated delivery URLs, server-owned pricing, checkout, verified payment webhook, idempotent print submission, delivery webhooks, order history, refunds/reprints, retention/deletion handling, and end-to-end tests.

No fabricated prices, delivery promises, successful login, live cloud saves, paid orders, or complete competitor parity are claimed. Preview HTML is a personal export, not a press-ready production PDF.

## US-first supplier shortlist

User reports Google Analytics traffic is mostly US. This is a user-provided priority, not an independent analytics audit.

- **Prodigi — first evaluation candidate.** Official US catalog lists hardcover, softcover, and layflat books. Quote and spine APIs and Studio tooling fit the proposed workflow. Validate SKU-level US routing and total landed cost. Sources: https://www.prodigi.com/products/us/ ; https://www.prodigi.com/print-api/docs/reference/ ; https://studio.prodigi.com/
- **Gelato — compare against Prodigi.** Offers personalized photo books and API support for multipage files and cover dimensions. Validate exact US manufacturing route, editor terms, SKU limits, and shipping quotes. Sources: https://www.gelato.com/products/photo-books ; https://dashboard.gelato.com/docs/get-started/ ; https://dashboard.gelato.com/docs/products/product/cover-dimensions/
- **Cloudprinter — alternative network.** Offers print APIs, photo books, and US production coverage. Confirm exact photo-book options, onboarding/support, routing, and webhook semantics. Sources: https://www.cloudprinter.com/countries/local-printing-in-the-united-states-with-global-print-api ; https://www.cloudprinter.com/

Recommendation is an engineering fit assessment, not a verified quality or price ranking. Compare identical 24/48/80-page books shipped to New York, California, and Texas before selecting.

## Competitor priorities

- Huckleberry: sleep prediction and expert guidance. Boodoo already has tracking/routine estimates; expert sleep coaching is a gap.
- Qeepsake: low-effort prompts to printed stories. Boodoo has journal/book concepts; print checkout, reminder automation, and SMS journaling are gaps.
- FamilyAlbum: private sharing and recurring photo products. Boodoo has household sync; social reactions/comments and print subscriptions are gaps.
- Mixbook: mature creative editor and production pipeline. Boodoo has a first studio; advanced layouts, image transforms, collaboration, and fulfillment are gaps.

The public `/compare` route links to official sources and separates current iOS features, website features, and future work. Do not use absolute 'has everything competitors have' claims.

## Run

Use Node 22+ and pnpm. `pnpm install --ignore-scripts`; `pnpm dev`; `pnpm build`; `pnpm start`. The project now needs Next.js server hosting for the supplier API; static export alone is insufficient. Existing Vercel hosting can run Next.js. Keep this as a preview/draft until setup above is verified.

For logic checks, compile `lib/v2/model.ts` and `lib/v2/print-provider.ts` into `tests/compiled` with TypeScript, then run `node --test tests/model.test.cjs`. `tests/compiled` is ignored.

## October 13 follow-up

Added prominent shared access across multiple iPhones, parents and invited caregivers, and Android-coming-next messaging. Expanded the homepage with an 17-feature interactive guide using the newly supplied screenshots: daily overview, Caregiver Card, Lock Screen sleep Live Activity, care records, Health Stories, growth charts, development, Ask BooDoo, predicted routine, Evolution, and Moments/books. The guide distinguishes iOS features from the web preview. Vercel install failure was fixed by explicitly skipping the optional unrs-resolver lifecycle script; deployment of commit 277719d succeeded.

The latest child-picker screenshot replaces the older Family image and illustrates child-specific settings, sharing controls, multiple ages, and pregnancy profiles with due dates.

Homepage positioning now leads with Ask BooDoo insights grounded in logged records and an experience that adapts from pregnancy through baby and toddler stages. Dedicated sections, example questions, stage cards, and FAQs explain both benefits without fabricating AI answers.

Quick logging is a primary homepage benefit, illustrated by the user’s feeding, sleep, diaper, and solids screenshots. Copy describes one main screen as the starting point, while acknowledging detailed forms rather than claiming every entry requires a single tap.

Added dedicated breastfeeding, pumping/milk balance, goals, intervals, and reminders content using screenshots IMG_4032–4035. Shared-care copy explicitly explains QR-code sharing between Apple devices. Goals are described as tracking tools, not prescribed intake. No real invitation QR code is published. Reminder claims were checked against the previously reviewed iOS source.

## October 14: personal daily book and album repair

Reviewed iOS main `32f87bd035e705e32c279aeb1ee30d401c626f0e` and merged website main through `2ac9849`. Retained existing subscriptions and pricing. Added the user's latest screenshots to explain the daily book, photo backgrounds, colors, pregnancy stories and older-child care.

The web preview now matches the iOS three-memory draft threshold; 8 memories / 3 photos / 3 days are editorial goals. Existing photo-only journal entries are retained. When completed chapters do not include enough saved Moments, new drafts use a custom period rather than silently starting empty. Custom chapters remain selectable and include the full end date. The newer full-photo and framing editor changes are synchronized into both deployment roots.

Prodigi source and its README explicitly describe sandbox quotes, with no orders or payments. The new web proxy forwards only Firebase authorization plus destination/currency/page count/copies to the fixed existing Firebase endpoint. No child records or images are sent. The editor offers a labeled sandbox test after login; demo mode does not call the supplier. A real-account quote and cloud draft save cannot be verified without configured web Firebase access and a signed-in account. No production ordering is claimed.

Validation: production build and 11 model/provider regression tests passed. Browser demo creation and caption save passed.

## Premium website editor (14 October)

The iPhone editor is a reference only; implementation is in the existing website Albums screen. See `docs/PREMIUM_WEB_EDITOR.md` for the v2 composition model, browser autosave, legacy migration, controls and remaining print/cloud acceptance work. Local tests: 26 passing; production build passed. Interactive browser QA was blocked by the URL security gate, so the PR remains a review draft pending acceptance rather than a claim of fully verified production delivery.

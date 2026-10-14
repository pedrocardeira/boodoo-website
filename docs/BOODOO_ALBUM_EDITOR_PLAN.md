# BooDoo.app — Secure Signature Book Editor Implementation Plan

**Stage:** technical foundation only; nothing published or enabled on the public website by this branch.

The source of truth for album eligibility, content curation, visual design and printer requirements is [BooDoo Signature Book spec](https://github.com/pedrocardeira/boodoo-ios/blob/feature/age-aware-boodoo-book-template/docs/BOODOO_SIGNATURE_BOOK_SPEC.md).

## User journey

- iOS Moments → available chapters only → draft preview → **Continue on boodoo.app**.
- Parent signs in to the *same existing* Firebase household; never place a permanent bearer token in a link.
- `/albums` shows saved drafts for this parent's authorized children; `/albums/[id]` edits the draft; `/albums/[id]/preview` performs final preview.
- On desktop: sortable page thumbnails, page canvas and contextual properties panel. On narrow screens: stacked page editor, bottom edit sheet.
- Autosave and show last saved state; resume the exact draft on iPhone or desktop.

## Required backend before release

1. Reconcile Firebase anonymous iOS identities with a durable registered user without losing the existing household or baby profile.
2. Add Firestore `bookDrafts` access model and permissions, strict household/child isolation, owner-only edit by default, typed validation, revision-based concurrency, and deletion policy. Consider all existing Storage/Firestore rules; don't weaken them for the website.
3. Transfer only parental-selected photos and required texts to private Cloud Storage after explicit consent. Protect originals from public URLs, avoid cross-child reuse, generate short-lived view authorization.
4. Implement a shared normalization pipeline that merges recorded Moments, selected Care and verified achievements; never automatically copy health/symptom/medication/vaccine details; no implicit clinical inference.
5. Support versioned page blocks in `lib/album-types.ts`; no duplicate pages and no invented milestone. Server validates chapter eligibility and draft edits.
6. Add high-quality BooDoo Signature block renderers and accurate paginated preview with cover/spine/bleed-aware guides. Preserve parent edits across content refreshes and keep revision history/Undo.
7. Backend export must generate the exact print-ready product for a verified Prodigi SKU, validate print resolution and product constraints, and produce a final approval snapshot.
8. Stripe or another suitable payment solution for **physical goods**; tax, margins, shipping quote and final retail price must be clear. After confirmed payment and approval use Prodigi Live server-to-server with idempotency; track production/shipping via supplier status, no order from Sandbox quote page.
9. Update product privacy policy, photo/health data controls, retention and deletion, user-requested erasure and clear worldwide printer transfer notice before feature release.

## Suggested milestones

**M1: Editor shell and authentication.** Protected album routes, linked Firebase identity, empty/private drafts list, rules tests, no public album content.

**M2: Stories.** Draft creation from iOS and consistent types, page canvas for photo story / mixed story / achievement / closing page, edit text, crop picture, reorder pages, autosave with conflict checks.

**M3: Print QA.** Server renderer, SKU/page-length validation, accurate preview and international quote, explicit parent approval.

**M4: Commerce.** Payment and Live fulfillment, delivery tracking, refund/cancellation support.

## Acceptance tests

- Unauthenticated user or wrong household cannot list, preview or edit a book, even with its ID.
- Family sharing permissions and the selected child are checked on every operation; no other child's images appear.
- A 6-month-old never sees a 12-month/first-year album; eligibility is recomputed on the server, not trusted from browser input.
- Only opted-in Care data is included. Pending appointments and future milestones are excluded.
- Achievements show restrained confetti/ribbons and readable icons/labels, not generic or medical celebration.
- Changes made on the website remain on mobile, and new iOS records do not clobber edited pages.
- Export and checkout refuse invalid page counts, missing bleed, low-resolution photos and unverified order approval.
- Payment retries cannot cause double orders.

**Current status:** This branch introduces the editor's versioned TypeScript contracts and implementation plan. It does *not* yet add public editor routes, Firebase login, album data storage or production ordering. Do not advertise as live.

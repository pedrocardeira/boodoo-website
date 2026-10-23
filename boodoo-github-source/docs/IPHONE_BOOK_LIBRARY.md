# Private iPhone book library

Create and edit books in iOS. In Review album → Digital review copy, Pro users explicitly choose **Send PDF to my web library** and confirm the upload. The source draft and Moments are untouched. Web Albums lists the snapshots for the signed-in owner and selected child. PDFs are opened and downloaded byte-for-byte; spreads are already paginated by the iOS renderer. These digital copies are not certified print proofs.

## Contract v1

Storage object: `users/{auth.uid}/publishedBooks/{childID}/{random UUID}.pdf`.

MIME `application/pdf`, 0 < size < 75 MiB. Custom metadata: `kind: boodoo-digital-book-v1`, `childID`, `title`, `pageCount` (physical PDF pages including covers), `createdAt` (ISO timestamp). List sorting uses the server's creation timestamp. No public download-token URL is created by the app or website. Web uses authenticated `getBlob`; the temporary browser object URL is revoked on close, account/profile change, refresh or unmount. Snapshots cannot be overwritten by the client.

Books are private to the uploading account, not automatically visible to other family members. Existing user/household membership and profile sync must already be configured to access the family portal. No checkout or Prodigi order is enabled.

## Deployment and verification

The Firebase Storage rules change lives in `boodoo-ios/Firebase/storage.rules`. For this rollout, add only the `publishedBooks` block to the currently deployed rules, preserving the existing permissions; do not inadvertently deploy unrelated household access changes. Direct downloads require GET/HEAD CORS for `https://boodoo.app`, `https://www.boodoo.app`, and the established `codex/boodoo-v2` Vercel branch origin. Authentication and Storage rules still enforce access.

Validation: iOS simulator build; existing full-PDF proof and physical page-count regressions; Storage emulator tests for owner list/read, byte preservation, foreign/signed-out denial, anonymous upload denial, immutable snapshots and malformed metadata. Web tests cover metadata scope, invalid files and exact PDF byte preservation; production build checks integration.

Still requires end-to-end validation with a real signed-in test account, an upload from the updated iPhone app, and visual PDF preview/download on Safari, Chrome and Firefox. Embedded PDF support differs; explicit open-in-new-tab and download controls remain available. Exact download bytes preserve PDF pagination independently of the browser renderer. Legacy web-book browser print pagination is a separate path and is not certified by these tests.

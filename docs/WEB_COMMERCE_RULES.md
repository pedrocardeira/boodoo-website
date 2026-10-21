# Firestore commerce security requirements

This file is an **additive reference**, NOT a deployable replacement for the existing BooDoo iOS Firestore rules.

Before enabling payments, inspect the **deployed** rules of the existing Firebase project and make sure no overlapping wildcard allows a mobile/web client to read or write these server-managed collections:

```rules
// Inside match /databases/{database}/documents
match /users/{uid}/bookOrders/{orderId} {
  allow read, write: if false;
}
match /users/{uid}/printManifests/{albumId} {
  allow read, write: if false;
}
```

The browser reads order summaries only through the authenticated `GET /api/print/orders` API and must never be given the full Firestore order/manifest document because it contains customer contact/shipping details and signed print-file URLs.

**IMPORTANT:** Firestore rules are OR-combined when several matches apply. A recursive match such as `match /{document=**} { allow read, write: if request.auth != null; }` would override the deny rules above. Remove/refactor broad permissive rules. Verify with the Firestore emulator in both the website and iOS rulesets. The site repository cannot deploy iOS Firebase rules automatically.

- Anonymous/user A cannot read or write user B orders, manifests or private photo paths.
- User A cannot create or alter their own `printManifests` or `bookOrders` directly through the Firestore client API.
- Admin service account REST writes work via minimum-required IAM permission, independent of mobile/web rules.
- `BOOK_MANIFEST_SIGNING_SECRET` (32+ cryptographically random characters) is set server-side; its HMAC signature ties owner/child, album revision, SKU, page count, print areas and file URLs. No client is allowed to sign manifests.
- Changing the saved album's `updatedAt` invalidates a prior manifest, and changing the manifest's data invalidates its signature.
- Customer-facing order API returns only status, a short order ID, amount/currency and safe tracking data. Neither a URL with a download token nor a recipient postal address is included.
- Check Firestore data retention, support access, lawful disclosure to Prodigi, account deletion and historical order records before production.

Official note on overlapping rules: https://firebase.google.com/docs/rules/rules-behavior

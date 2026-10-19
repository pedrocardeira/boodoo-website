# Additive web album rules

Do not replace the iOS project's existing rules with this file. Merge these specific matches into the current Firebase rules, test them with the Firebase emulator, and deploy only after confirming the existing household and caregiver tests still pass. These rules are not deployed by the website build.

Inside the existing Firestore `match /databases/{database}/documents`:

```rules
match /users/{uid}/webAlbums/{albumID} {
  function ownsAlbum() { return request.auth != null && request.auth.uid == uid; }
  allow read, delete: if ownsAlbum();
  allow create, update: if ownsAlbum()
    && request.resource.data.keys().hasOnly(['id','title','childID','style','period','updatedAt','moments'])
    && request.resource.data.id == albumID
    && request.resource.data.title is string
    && request.resource.data.title.size() <= 100
    && request.resource.data.childID is string
    && request.resource.data.style in ['Boodoo Classic','Soft Childhood','Minimal','Color Story']
    && request.resource.data.period is string
    && request.resource.data.updatedAt is string
    && request.resource.data.moments is list
    && request.resource.data.moments.size() <= 300;
}
```

Inside the existing Storage `match /b/{bucket}/o`:

```rules
match /users/{uid}/webAlbumAssets/{albumID}/{assetID} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow create, update: if request.auth != null && request.auth.uid == uid
    && request.resource.size < 15 * 1024 * 1024
    && request.resource.contentType.matches('image/(jpeg|png|webp)');
  allow delete: if request.auth != null && request.auth.uid == uid;
}
```

Required emulator checks: owner read/write succeeds; other user and anonymous access fails; oversize/non-image upload fails; unrelated household membership rules are unchanged. Verify Storage download CORS for deployed website origins. Firebase download-token URLs are bearer links: do not expose private album URLs in public metadata, analytics, or logs. An authenticated download endpoint and short-lived asset delivery should replace long-lived token URLs before a full production fulfillment launch.

Activate `NEXT_PUBLIC_WEB_ALBUMS_ENABLED=true` only after those checks and a real-account smoke test. The app does not currently read `webAlbums`; two-way iOS/web album sync needs a shared album schema and an iOS change. Deleting a draft does not yet clean up stored photo assets; add an authenticated cleanup job before broad release.

## Private print proof PDFs (additive Storage rules)

After setting up web album saving, add this **additional** narrow match in Storage.
Do not deploy this excerpt in place of the iOS project's complete rules.

```rules
match /users/{uid}/webAlbumProofs/{albumID}/{proofID} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow create: if request.auth != null && request.auth.uid == uid
    && proofID.matches('[A-Za-z0-9_-]+[.]pdf')
    && request.resource.size > 10 * 1024
    && request.resource.size < 75 * 1024 * 1024
    && request.resource.contentType == 'application/pdf';
  allow update: if false; // Immutable upload; prevent approved proof replacement.
  allow delete: if request.auth != null && request.auth.uid == uid;
}
```

A saved real album can generate a private 300dpi RGB JPEG-in-PDF proof for print
review. The PDF is not automatically approved for sale. Staff fetch a time-limited
proof link from `POST /api/print/proof-inspect` and manually verify the file
against the confirmed Prodigi SKU. Only staff can call `POST /api/print/approve`
to sign a fixed GCS object generation and album revision. Buyer edits to an
album invalidate its approval. Prodigi receives a short-lived signed GCS
download link generated at the time of print submission.

Inspect deployed wildcard rules for accidental broader matching, and test
anonymous/cross-user access plus upload size and MIME restrictions in the
Firebase emulator. Keep exported PDF URLs out of public logs or analytics.

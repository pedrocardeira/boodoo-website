# BooDoo pediatrics preview runbook

This preview publishes a verified professional profile and its consultation
prices. The consultation contract now has explicit, fail-closed gates for
agenda, paid booking, clinical messages and browser video rooms.

## What is enabled

- Professional registration, document upload, reviewer verification, and
  consent-based family-record access.
- A verified profile with optional message and video price rows, video duration,
  currency, cancellation policy, and optional monthly plan.
- Preview-only web portal access behind `BOODOO_PEDIATRICS_PORTAL_ENABLED`.
- The pediatrician's working surface is the web portal. A family uses the
  iPhone app and, for video, opens the same protected browser room.

## Data-sharing acceptance check

The family must be able to understand the permission before confirming it.
On the iPhone, open **Pediatrics → Find a doctor → Choose this pediatrician**
and verify that the screen shows:

- the exact child and pediatrician;
- one row per category with a plain-language description and a preview link;
- the number of selected categories and the expiry date;
- a clear statement that photos, memories and albums are never shared;
- guardian and Belgium confirmations before **Authorize this sharing** becomes
  available.

After authorization, **My doctors** repeats the same categories, expiry and
revocation control. In the professional portal, **Shared records** shows only
the authorized categories and opens each category separately. If a category is
not listed, it must not be readable by the pediatrician.

## Tomorrow's smoke test

1. In an iOS Debug build, open Pediatrics, choose the sandbox pediatrician and
   inspect the permission screen before selecting anything.
2. Select one category, open its preview, then select a second category and
   confirm that the summary and expiry update immediately.
3. Authorize for one day, return to **My doctors**, verify the category list,
   then revoke and confirm that the access state changes to revoked.
4. Sign in to the Preview professional portal with the reviewer/doctor test
   account and verify that the same categories are visible under **Shared
   records**.
5. Keep payments/video flags off for this smoke test. Once Stripe and the
   video provider values are supplied, repeat with one held slot, one test
   payment and both participants joining the same room.

## Launch gates

The backend exposes schedule, slot reservation and room authorization only
when all of the following are true in both environment configuration and
`serviceConfiguration/pediatrics`:

```text
BOODOO_PEDIATRICS_ENGAGEMENTS_ENABLED=true
BOODOO_PEDIATRICS_PAYMENTS_ENABLED=true
BOODOO_PEDIATRICS_VIDEO_ENABLED=true
BOODOO_PEDIATRICS_VIDEO_BASE_URL=https://preview.example/pediatrics/call
```

The room is never created for an unpaid booking. A real launch still needs a
Stripe sandbox/webhook and a video provider/TURN configuration; the default
values remain `false` and the URL remains empty.

## Safe preview configuration

Set the following only in a Vercel Preview environment:

```text
BOODOO_PEDIATRICS_PORTAL_ENABLED=true
```

The page and `/api/pediatrics` return `404` whenever `VERCEL_ENV=production`,
even if the flag is accidentally copied to Production. Keep the branch
deployment gate in `vercel.json` disabled until a release is explicitly
approved.

For the Firebase sandbox, registration/pricing/consent may be enabled with:

```text
BOODOO_PEDIATRICS_ENABLED=true
BOODOO_PEDIATRICS_CLINICAL_ENABLED=false
BOODOO_PEDIATRICS_ENGAGEMENTS_ENABLED=false
BOODOO_PEDIATRICS_PAYMENTS_ENABLED=false
BOODOO_PEDIATRICS_VIDEO_ENABLED=false
BOODOO_PEDIATRICS_VIDEO_BASE_URL=
```

The Firestore service configuration must keep the three corresponding launch
flags false until the payment and video-provider reviews are complete.

## Release checks

Run these from the corresponding repository before publishing a preview:

```text
website:  npm test && npm run build
functions: npm test
iOS:      for test in scripts/test_*.py; do python3 "$test"; done
          plus the approved Xcode simulator build
```

Then smoke-test: email verification, registration upload, reviewer approval,
profile/QR identity, consented records, and the published price display. When
the launch gates are enabled in a separate sandbox, also test schedule overlap,
unpaid-room rejection, paid booking, and both participants joining the same
room. A production URL must stay unavailable until the clinical, payment and
video-provider reviews have their own approval and tests.

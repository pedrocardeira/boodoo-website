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

# BooDoo pediatrics preview runbook

This release publishes a verified professional profile and its consultation
prices. It does not provide a consultation channel or collect money.

## What is enabled

- Professional registration, document upload, reviewer verification, and
  consent-based family-record access.
- A verified profile with optional message and video price rows, video duration,
  currency, cancellation policy, and optional monthly plan.
- Preview-only web portal access behind `BOODOO_PEDIATRICS_PORTAL_ENABLED`.

## What remains disabled

Payments, booking, clinical chat, and videocalls are not implemented in this
phase. Do not add a checkout, appointment, message, or video action to the
portal proxy or Firebase function without a separate security and product
review.

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
```

The Firestore service configuration must also keep `clinicalEnabled=false`.
There is no payment, booking, chat, or video endpoint in this release.

## Release checks

Run these from the corresponding repository before publishing a preview:

```text
website:  npm test && npm run build
functions: npm test
iOS:      python3 scripts/test_*.py (all scripts) and the approved Xcode simulator build
```

Then smoke-test: email verification, registration upload, reviewer approval,
profile/QR identity, consented records, and the published price display. A
production URL must stay unavailable until the clinical and commercial phases
have their own review and tests.

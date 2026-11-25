# BooDoo Preview QA agent

The repository's automated test agent is named **BooDoo Preview QA**.

On every pull request that changes `boodoo-github-source`, and on pushes to
`codex/126-pediatrics-consent-only`, it:

1. installs the same dependencies used by the Vercel source;
2. runs the source's unit/composition tests;
3. runs the production build;
4. waits for the branch preview and checks `/pediatrics` and
   `/pediatrics/admin` for a real non-404 response.

The workflow is `.github/workflows/preview-qa-agent.yml`. The preview URL can
be changed without editing code by setting the repository variable
`BOODOO_PREVIEW_URL`.

The route smoke test deliberately does not store a password. Authenticated
admin/doctor/parent tests should use separate Firebase QA accounts and
repository secrets in a later step. The administrator account must have the
server-side custom claim `pediatricAdmin: true` (or `boodooAdmin: true`).

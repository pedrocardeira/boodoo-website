# BooDoo website release boundary

- The public website must describe only the currently released App Store version.
- BooDoo v2 is in development. Keep its website in `codex/boodoo-v2` and Vercel Preview only.
- Do not merge v2 website changes into `main`, promote a preview, or change the production branch/domain without the owner explicitly confirming the app v2 is live and authorizing the website launch.
- Requests to continue, implement, test, or integrate iPhone code do not authorize a public website release.
- Production restoration and v1 fixes must preserve the v2 preview branch and unrelated payment/backend work.
- Run the public release guard for changes targeting main. Do not remove or bypass it to make CI/deployment pass.

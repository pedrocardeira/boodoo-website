const fs = require('node:fs');
const path = require('node:path');

function publicReleaseIssues(root) {
  const issues = [];
  for (const route of ['family', 'albums', 'pricing', 'compare']) {
    if (fs.existsSync(path.join(root, 'app', route, 'page.tsx'))) issues.push(`Unreleased v2 route: /${route}`);
  }
  for (const file of ['app/page.tsx', 'app/layout.tsx']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    if (/components\/v2|boodoo-v2|screenshots\/v2/.test(source)) issues.push(`Unreleased v2 entry point: ${file}`);
  }
  return issues;
}
if (require.main === module && (process.env.VERCEL_ENV === 'production' || process.env.BOODOO_VALIDATE_PUBLIC_RELEASE === '1')) {
  const issues = publicReleaseIssues(process.cwd());
  if (issues.length) {
    console.error('PUBLIC RELEASE BLOCKED: BooDoo v2 has not been approved for the public website.\n' + issues.join('\n') + '\nUse a Vercel Preview deployment. Public v2 release requires the owner’s explicit confirmation after the app is available.');
    process.exitCode = 1;
  }
}
module.exports = { publicReleaseIssues };

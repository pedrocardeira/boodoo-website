const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { publicReleaseIssues } = require('../scripts/check-public-release.cjs');
const guard = path.resolve('scripts/check-public-release.cjs');

test('public builds reject v2 entry points and routes, while preview builds remain usable', () => {
 const root = fs.mkdtempSync(path.join(os.tmpdir(), 'boodoo-release-'));
 try {
  fs.mkdirSync(path.join(root, 'app/family'), { recursive: true });
  fs.writeFileSync(path.join(root, 'app/page.tsx'), 'import Home from "@/components/v2/home";');
  fs.writeFileSync(path.join(root, 'app/layout.tsx'), 'export default function Layout() {}');
  fs.writeFileSync(path.join(root, 'app/family/page.tsx'), 'export default function Family() {}');
  assert.equal(publicReleaseIssues(root).length, 2);
  for (const env of [{ VERCEL_ENV: 'production' }, { BOODOO_VALIDATE_PUBLIC_RELEASE: '1' }]) {
   const result = spawnSync(process.execPath, [guard], { cwd: root, env: { ...env }, encoding: 'utf8' });
   assert.equal(result.status, 1);
   assert.match(result.stderr, /PUBLIC RELEASE BLOCKED/);
  }
  assert.equal(spawnSync(process.execPath, [guard], { cwd: root, env: { VERCEL_ENV: 'preview' } }).status, 0);
  fs.unlinkSync(path.join(root, 'app/family/page.tsx'));
  fs.writeFileSync(path.join(root, 'app/page.tsx'), 'export default function Home() {}');
  assert.deepEqual(publicReleaseIssues(root), []);
  assert.equal(spawnSync(process.execPath, [guard], { cwd: root, env: { VERCEL_ENV: 'production' } }).status, 0);
 } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

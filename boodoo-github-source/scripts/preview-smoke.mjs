const baseURL = (process.env.BOODOO_PREVIEW_URL || 'https://boodoo-website-git-codex-126-ped-c9b846-pedrocardeiras-projects.vercel.app').replace(/\/$/, '');
const attempts = Number(process.env.BOODOO_PREVIEW_ATTEMPTS || 20);
const delayMs = Number(process.env.BOODOO_PREVIEW_RETRY_MS || 15000);

const checks = [
  {
    path: '/pediatrics',
    // This route is a client component. Its visible copy is added after
    // hydration, so the stable server-side contract for a fetch-only smoke
    // test is the route's metadata title.
    title: 'BooDoo Pediatrics',
  },
  {
    path: '/pediatrics/admin',
    // The page is client-authenticated, so the signed-in/signed-out copy is
    // intentionally not part of the fetch-only check. The preview metadata
    // still proves that this exact route is deployed.
    title: 'BooDoo · Administration',
  },
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function checkPage(check) {
  let lastError = 'no response';
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(`${baseURL}${check.path}`, { redirect: 'follow' });
      const body = await response.text();
      const is404 = response.status === 404 || /<h1[^>]*>404<\/h1>/i.test(body) || body.includes('This page could not be found');
      const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const pageTitle = titleMatch?.[1]?.replace(/<[^>]+>/g, '').replace(/&middot;|&#183;|&#xB7;/gi, '·').trim() ?? '';
      const matched = pageTitle.includes(check.title);
      if (response.ok && !is404 && matched) {
        console.log(`PASS ${check.path} (${response.status}; title=${pageTitle})`);
        return;
      }
      lastError = `${response.status}; title=${JSON.stringify(pageTitle)}; matched=${matched}; 404=${is404}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    if (attempt < attempts) await sleep(delayMs);
  }
  throw new Error(`Preview check failed for ${check.path} at ${baseURL}: ${lastError}`);
}

console.log(`BooDoo Preview QA · checking ${baseURL}`);
for (const check of checks) await checkPage(check);
console.log('BooDoo Preview QA · public and admin route smoke checks passed');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { NextRequest } = require('next/server');

const root = path.resolve(__dirname, '..');

// Execute the shipped TypeScript/TSX, stubbing only external configuration and
// transport. No Firebase project, patient records or medical service is used.
function loadSource(file, globals = {}, stubs = {}) {
  const filename = path.join(root, file);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename,
  }).outputText;
  const module = { exports: {} };
  const localRequire = name => {
    if (Object.hasOwn(stubs, name)) return stubs[name];
    if (name.endsWith('.module.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
    if (name.startsWith('@/')) return loadSource(`${name.slice(2)}.ts`, globals, stubs);
    return require(name);
  };
  vm.runInNewContext(code, { module, exports: module.exports, require: localRequire, Buffer, AbortSignal, ...globals }, { filename });
  return module.exports;
}

function proxy({ environment = 'preview', enabled = 'true', body = {}, responseStatus = 200 } = {}) {
  const calls = [];
  const { POST } = loadSource('app/api/pediatrics/route.ts', {
    process: { env: { VERCEL_ENV: environment, BOODOO_PEDIATRICS_PORTAL_ENABLED: enabled } },
    fetch: async (url, options) => {
      calls.push({ url, options });
      return Response.json(body, { status: responseStatus });
    },
  }, { '@/lib/v2/firebase-public-config': { firebaseWebConfig: { projectId: 'synthetic-preview' } } });
  const request = (input, authorization = 'Bearer synthetic.preview.token') => POST(new NextRequest('http://localhost/api/pediatrics', {
    method: 'POST', headers: authorization ? { authorization } : {}, body: JSON.stringify(input),
  }));
  return { request, calls, POST };
}

const legacyProfile = {
  uid: 'synthetic-doctor', name: 'Dr Preview', city: 'Brussels', country: 'BE', languages: 'French, Dutch',
  biography: 'Synthetic professional profile.', status: 'verified', acceptingPatients: true, profileCode: 'SYNTHETIC_QR',
  serviceHours: 'Legacy working hours', responseHours: 12,
  offer: { name: 'LEGACY_OFFER_SENTINEL', monthlyAmount: 98765, videoAmount: 87654, subscriberVideoAmount: 76543, episodes: 8 },
  offers: [{ name: 'LEGACY_OFFER_LIST_SENTINEL' }], prices: { appointment: 45678 },
  verification: { registrationNumber: 'TEST-REGISTRATION', visaNumber: 'TEST-VISA', authority: 'Synthetic council', credentialPath: 'synthetic/evidence.pdf', insuranceValidUntil: 2000000000000, commercialTerms: 'LEGACY_TERMS_SENTINEL' },
};

test('proxy rejects commercial, messaging and arbitrary actions without contacting the backend', async () => {
  const { request, calls } = proxy();
  for (const action of ['saveOffer', 'bookings', 'booking', 'createBooking', 'requestBooking', 'subscriptions', 'subscribe', 'startSubscription', 'episodes', 'startEpisode', 'messages', 'sendMessage', 'checkout', 'toString', '__proto__', 'unknownAction']) {
    const response = await request({ action, offer: legacyProfile.offer });
    assert.equal(response.status, 403, action);
    assert.deepEqual(await response.json(), { error: 'action_not_available' });
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
  for (const input of [null, [], { action: ['profile'] }, { action: 'profile', offer: legacyProfile.offer }, { action: 'register', monthlyAmount: 100 }, { action: 'review', paymentsEnabled: true }]) {
    assert.equal((await request(input)).status, 403);
  }
  assert.equal(calls.length, 0);
});

test('proxy retains the exact identity, registration, review and consented-record requests', async () => {
  const requests = [
    { action: 'status' }, { action: 'profile' },
    { action: 'register', name: 'Dr Preview', city: 'Brussels', languages: 'Dutch', biography: 'Synthetic profile', registrationNumber: 'TEST', visaNumber: 'TEST', authority: 'Council', insuranceValidUntil: 2000000000000, credentialPath: 'synthetic/evidence.pdf', country: 'BE', requestedRegions: ['BE'] },
    { action: 'setAvailability', acceptingPatients: false },
    { action: 'setPricing', pricing: { currency: 'EUR', messageCents: 900, videoCents: 3500, videoMinutes: 30, monthlyCents: null, cancellationPolicy: 'Free cancellation up to 24 hours before.' } },
    { action: 'patients' },
    { action: 'medicalRecords', linkID: 'synthetic-consent', scope: 'growth' }, { action: 'reviewQueue' },
    { action: 'review', doctorUID: 'synthetic-doctor', status: 'verified', verificationSource: 'https://example.com/check', verificationExpiresAt: 2000000000000, licensedRegions: ['BE'], identityVerified: true, licenseVerified: true, specialistVerified: true, insuranceVerified: true },
  ];
  const { request, calls } = proxy();
  for (const input of requests) assert.equal((await request(input)).status, 200, input.action);
  assert.equal(calls.length, requests.length);
  calls.forEach(({ url, options }, index) => {
    assert.equal(url, 'https://europe-west1-synthetic-preview.cloudfunctions.net/pediatricCare');
    assert.deepEqual(JSON.parse(options.body), requests[index]);
    assert.equal(options.headers.Authorization, 'Bearer synthetic.preview.token');
    assert.equal(options.cache, 'no-store');
  });
});

test('legacy profile and reviewer responses cannot expose offers, prices or response promises', async () => {
  for (const [action, body, key] of [['profile', { profile: legacyProfile }, 'profile'], ['reviewQueue', { profiles: [legacyProfile] }, 'profiles']]) {
    const { request } = proxy({ body });
    const result = await (await request({ action })).json();
    const profile = key === 'profile' ? result.profile : result.profiles[0];
    assert.equal(profile.profileCode, 'SYNTHETIC_QR');
    assert.equal(profile.verification.registrationNumber, 'TEST-REGISTRATION');
    assert.equal(profile.verification.credentialPath, 'synthetic/evidence.pdf');
    assert.doesNotMatch(JSON.stringify(result), /LEGACY_|98765|87654|76543|45678|serviceHours|responseHours|offer|prices|commercialTerms/);
  }
  const { request } = proxy({ body: { enabled: true, registrationEnabled: true, clinicalEnabled: true, reviewer: false, paymentsEnabled: true, videoEnabled: true } });
  assert.deepEqual(await (await request({ action: 'status' })).json(), { enabled: true, registrationEnabled: true, clinicalEnabled: true, reviewer: false });
});

test('authorized records remain readable and a revoked consent error remains denied', async () => {
  const records = [{ id: 'synthetic-record', data: { weightKg: 4.5, date: '2026-01-01' } }];
  const allowed = proxy({ body: { records } });
  const response = await allowed.request({ action: 'medicalRecords', linkID: 'synthetic-consent', scope: 'growth' });
  assert.deepEqual(await response.json(), { records });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const denied = proxy({ body: { error: 'consent_required' }, responseStatus: 403 });
  const revoked = await denied.request({ action: 'medicalRecords', linkID: 'synthetic-consent', scope: 'growth' });
  assert.equal(revoked.status, 403);
  assert.deepEqual(await revoked.json(), { error: 'consent_required' });
});

test('production, disabled preview, unauthenticated and invalid requests never reach a backend', async () => {
  for (const options of [{ environment: 'production' }, { enabled: 'false' }, { enabled: '' }]) {
    const { request, calls } = proxy(options);
    assert.equal((await request({ action: 'profile' })).status, 404);
    assert.equal(calls.length, 0);
  }
  const { request, calls, POST } = proxy();
  assert.equal((await request({ action: 'profile' }, '')).status, 401);
  assert.equal((await request({ action: 'profile' }, 'Basic synthetic')).status, 401);
  const badJSON = new NextRequest('http://localhost/api/pediatrics', { method: 'POST', headers: { authorization: 'Bearer synthetic.token' }, body: '{' });
  assert.equal((await POST(badJSON)).status, 400);
  assert.equal((await request({ action: 'register', biography: 'x'.repeat(32769) })).status, 413);
  assert.equal(calls.length, 0);
});

test('real professional overview/profile components render QR identity and consent without legacy commerce', () => {
  const { ProfessionalOverview, ProfessionalProfile, portalPanels } = loadSource('components/pediatrics/professional-space.tsx');
  const noop = () => {};
  const overview = renderToStaticMarkup(React.createElement(ProfessionalOverview, { profile: legacyProfile, authorizationCount: 2, busy: false, onRegistration: noop, onCopyProfile: noop }));
  const profile = renderToStaticMarkup(React.createElement(ProfessionalProfile, { profile: legacyProfile, busy: false, onAvailability: noop }));
  assert.match(overview, /2 active authorizations/);
  assert.match(overview, /QR code identifies you/);
  assert.match(overview, /Copy profile link/);
  assert.match(overview, /can revoke access/);
  assert.match(profile, /Dr Preview/);
  assert.match(profile, /Pause new connections/);
  assert.match(profile, /Published consultation prices/);
  assert.match(profile, /No prices published yet/);
  assert.doesNotMatch(overview + profile, /LEGACY_|98765|87654|76543|45678|Legacy working hours|offer|subscription|billing|episodes|response window/i);
  const published = { ...legacyProfile, pricing: { currency: 'EUR', messageCents: 900, videoCents: 3500, videoMinutes: 20, monthlyCents: null, cancellationPolicy: 'Free cancellation up to 24 hours before.' } };
  const publishedMarkup = renderToStaticMarkup(React.createElement(ProfessionalProfile, { profile: published, busy: false, onAvailability: noop, onSavePricing: async () => {} }));
  assert.match(publishedMarkup, /€9\.00/);
  assert.match(publishedMarkup, /€35\.00/);
  assert.match(publishedMarkup, /20 min/);
  assert.match(publishedMarkup, /Free cancellation up to 24 hours before/);
  assert.deepEqual(Array.from(portalPanels, panel => panel.id), ['overview', 'profile', 'patients', 'verification']);
  const pending = renderToStaticMarkup(React.createElement(ProfessionalOverview, { profile: { ...legacyProfile, status: 'pending' }, authorizationCount: 0, busy: false, onRegistration: noop, onCopyProfile: noop }));
  assert.doesNotMatch(pending, /Copy profile link/);
});

test('portal uses the tested professional components and has no hidden services form', () => {
  const source = fs.readFileSync(path.join(root, 'components/pediatrics/portal.tsx'), 'utf8');
  assert.match(source, /<ProfessionalOverview /);
  assert.match(source, /<ProfessionalProfile /);
  assert.doesNotMatch(source, /OfferForm|saveOffer|monthlyAmount|subscriberVideoAmount|serviceHours|responseHours|panel==='services'/);
});

import 'server-only';
import { createSign, randomUUID } from 'node:crypto';

type Stored<T> = { data: T; updateTime: string };
type ServiceAccount = { client_email: string; private_key: string; project_id: string };
let cachedToken: { token: string; until: number } | undefined;

function firebaseProject(): string {
  return process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
}

function serviceAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('Server database access is not configured.');
  const account = JSON.parse(raw) as ServiceAccount;
  if (!account.client_email || !account.private_key || !account.project_id ||
      account.project_id !== firebaseProject()) throw new Error('Invalid Firebase service account configuration.');
  return account;
}

function base64url(value: string | Buffer): string {
  return Buffer.from(value).toString('base64url');
}

async function googleToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.until) return cachedToken.token;
  const account = serviceAccount();
  const now = Math.floor(Date.now() / 1000);
  const jwtHeader = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(JSON.stringify({
    iss: account.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600, jti: randomUUID(),
  }));
  const signingInput = jwtHeader + '.' + claims;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const assertion = signingInput + '.' + base64url(signer.sign(account.private_key));
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    cache: 'no-store', signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('Google service authentication failed.');
  const result = await response.json() as { access_token?: string; expires_in?: number };
  if (!result.access_token) throw new Error('Google did not provide a service token.');
  cachedToken = { token: result.access_token, until: Date.now() + Math.min(3000, (result.expires_in || 3600) - 90) * 1000 };
  return cachedToken.token;
}

function documentURL(path: string): string {
  if (path.split('/').some(s => !s || s === '.' || s === '..' || !/^[a-zA-Z0-9_-]+$/.test(s))) {
    throw new Error('Invalid Firestore document path.');
  }
  return 'https://firestore.googleapis.com/v1/projects/' +
    encodeURIComponent(firebaseProject()) + '/databases/(default)/documents/' + path;
}

async function requestDB(path: string, init?: RequestInit, query?: URLSearchParams): Promise<Response> {
  const url = documentURL(path) + (query ? '?' + query.toString() : '');
  return fetch(url, {
    ...init, headers: {
      Authorization: 'Bearer ' + await googleToken(),
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
    }, cache: 'no-store', signal: AbortSignal.timeout(15000),
  });
}

type FirestorePayload = { fields?: { payload?: { stringValue?: string } }; updateTime?: string };
function decode<T>(value: FirestorePayload): Stored<T> {
  if (!value.fields?.payload?.stringValue || !value.updateTime) throw new Error('Malformed commerce record.');
  return { data: JSON.parse(value.fields.payload.stringValue) as T, updateTime: value.updateTime };
}
function body(value: unknown): string {
  return JSON.stringify({ fields: { payload: { stringValue: JSON.stringify(value) } } });
}

export async function readRecord<T>(path: string): Promise<Stored<T> | null> {
  const response = await requestDB(path);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to read commerce record.');
  return decode<T>(await response.json());
}

export async function createRecord(path: string, data: unknown): Promise<void> {
  const q = new URLSearchParams({ 'currentDocument.exists': 'false' });
  const response = await requestDB(path, { method: 'PATCH', body: body(data) }, q);
  if (response.status === 409 || response.status === 412) throw new Error('Commerce record already exists.');
  if (!response.ok) throw new Error('Failed to create commerce record.');
}

export async function replaceRecord(path: string, data: unknown, updateTime: string): Promise<void> {
  const q = new URLSearchParams({ 'currentDocument.updateTime': updateTime });
  const response = await requestDB(path, { method: 'PATCH', body: body(data) }, q);
  if (response.status === 409 || response.status === 412) throw new Error('Concurrent order update. Retry.');
  if (!response.ok) throw new Error('Failed to update commerce record.');
}

export async function listRecords<T>(path: string): Promise<T[]> {
  // This is a subcollection path, not a document. Derive the safe URL from parent document.
  const segments = path.split('/');
  if (segments.length % 2 !== 0 || segments.length < 2) throw new Error('Invalid collection path.');
  const collectionName = segments.pop()!;
  const base = documentURL(segments.join('/'));
  const url = base + '/' + encodeURIComponent(collectionName) + '?pageSize=100';
  const response = await fetch(url, {
    headers: { Authorization: 'Bearer ' + await googleToken() },
    cache: 'no-store', signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Failed to list order records.');
  const result = await response.json() as { documents?: FirestorePayload[]; nextPageToken?: string };
  if (result.nextPageToken) throw new Error('Order history exceeds first page. Pagination required.');
  return (result.documents || []).map(doc => decode<T>(doc).data);
}

export async function verifiedUser(request: Request): Promise<{ uid: string; email: string }> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1];
  if (!apiKey || !token) throw new Error('Authentication required.');
  const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + encodeURIComponent(apiKey), {
    method: 'POST', body: JSON.stringify({ idToken: token }),
    headers: { 'Content-Type': 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('Invalid or expired login.');
  const user = (await response.json() as { users?: Array<{ localId: string; email?: string }> }).users?.[0];
  if (!user?.localId) throw new Error('Invalid login.');
  return { uid: user.localId, email: user.email || '' };
}

export async function assertHouseholdMember(uid: string, childID: string): Promise<void> {
  const account = await getRawDocument('users/' + uid);
  const household = account?.fields?.householdID?.stringValue;
  if (!household || !/^[a-zA-Z0-9_-]+$/.test(household)) throw new Error('No verified family membership.');
  const member = await getRawDocument('households/' + household + '/members/' + uid);
  const baby = await getRawDocument('households/' + household + '/babies/' + childID);
  if (!member || !baby) throw new Error('Family or child access denied.');
}

async function getRawDocument(path: string): Promise<{ fields?: Record<string, { stringValue?: string }> } | null> {
  const response = await requestDB(path);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Could not validate family authorization.');
  return response.json();
}

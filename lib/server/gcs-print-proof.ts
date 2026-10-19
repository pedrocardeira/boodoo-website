import { createHash, createSign } from 'node:crypto';
import { googleToken, serviceAccount } from './commerce-store';

export type ProofObject = {
  storagePath: string;
  generation: string;
  contentType: string;
  size: number;
  pageCount: number;
  widthMm: number;
  heightMm: number;
  albumUpdatedAt: string;
};

function bucket(): string {
  const value = process.env.PRINT_PROOF_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '';
  if (!/^[a-z0-9][a-z0-9._-]{3,220}$/i.test(value)) throw new Error('Private print proof bucket is not configured.');
  return value;
}
function assertPath(uid: string, albumId: string, path: string): void {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(uid) ||
      !/^[a-zA-Z0-9_-]{1,128}$/.test(albumId) ||
      !/^users\/[a-zA-Z0-9_-]+\/webAlbumProofs\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.pdf$/.test(path) ||
      !path.startsWith('users/' + uid + '/webAlbumProofs/' + albumId + '/')) {
    throw new Error('Invalid private print proof path.');
  }
}
export async function readProofObject(uid: string, albumId: string, storagePath: string): Promise<ProofObject> {
  assertPath(uid, albumId, storagePath);
  const response = await fetch('https://storage.googleapis.com/storage/v1/b/' + encodeURIComponent(bucket()) +
    '/o/' + encodeURIComponent(storagePath), {
    headers: { Authorization: 'Bearer ' + await googleToken() },
    cache: 'no-store', signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Saved print PDF is missing or not authorized for server access.');
  const result = await response.json() as {
    name?: string; generation?: string; size?: string; contentType?: string;
    metadata?: Record<string, string>;
  };
  const meta = result.metadata || {};
  const size = Number(result.size);
  const pageCount = Number(meta.pageCount);
  const widthMm = Number(meta.widthMm);
  const heightMm = Number(meta.heightMm);
  if (result.name !== storagePath || !/^\d+$/.test(result.generation || '') ||
      result.contentType !== 'application/pdf' || !Number.isSafeInteger(size) ||
      size < 10000 || size > 75 * 1024 * 1024 || meta.kind !== 'boodoo-print-proof' ||
      !Number.isInteger(pageCount) || pageCount < 24 || pageCount > 300 || pageCount % 2 !== 0 ||
      !Number.isFinite(widthMm) || !Number.isFinite(heightMm) ||
      widthMm < 140 || widthMm > 300 || heightMm < 140 || heightMm > 300 ||
      !meta.albumUpdatedAt) {
    throw new Error('Saved print PDF failed basic metadata checks.');
  }
  return {
    storagePath, generation: result.generation!,
    contentType: result.contentType!, size, pageCount, widthMm, heightMm,
    albumUpdatedAt: meta.albumUpdatedAt,
  };
}
function encode(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}
export function signedProofUrl(path: string, generation: string, expiresSeconds = 7 * 24 * 3600): string {
  if (!/^users\/[a-zA-Z0-9_-]+\/webAlbumProofs\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.pdf$/.test(path) ||
      !/^\d+$/.test(generation) || !Number.isInteger(expiresSeconds) ||
      expiresSeconds < 60 || expiresSeconds > 604800) throw new Error('Invalid proof signing request.');
  const account = serviceAccount();
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const date = now.substring(0, 8);
  const scope = date + '/auto/storage/goog4_request';
  const query: Record<string, string> = {
    'X-Goog-Algorithm': 'GOOG4-RSA-SHA256',
    'X-Goog-Credential': account.client_email + '/' + scope,
    'X-Goog-Date': now,
    'X-Goog-Expires': String(expiresSeconds),
    'X-Goog-SignedHeaders': 'host',
    generation,
  };
  const queryString = Object.entries(query).sort(([a],[b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([key, value]) => encode(key) + '=' + encode(value)).join('&');
  const resource = '/' + encode(bucket()) + '/' + path.split('/').map(encode).join('/');
  const request = ['GET', resource, queryString, 'host:storage.googleapis.com\n', 'host', 'UNSIGNED-PAYLOAD'].join('\n');
  const hash = createHash('sha256').update(request).digest('hex');
  const stringToSign = ['GOOG4-RSA-SHA256', now, scope, hash].join('\n');
  const signer = createSign('RSA-SHA256');
  signer.update(stringToSign); signer.end();
  const signature = signer.sign(account.private_key).toString('hex');
  return 'https://storage.googleapis.com' + resource + '?' + queryString + '&X-Goog-Signature=' + signature;
}

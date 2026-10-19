import { NextResponse } from 'next/server';
import { assertHouseholdMember, createRecord, getAlbumSummary, readRecord, replaceRecord, verifiedUser } from '@/lib/server/commerce-store';
import { type BookManifest, manifestPath, signApprovedManifest, validateManifest } from '@/lib/server/book-commerce';
import { readProofObject, signedProofUrl } from '@/lib/server/gcs-print-proof';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  let actor;
  try { actor = await verifiedUser(request); }
  catch { return NextResponse.json({ error: 'Authentication required.' }, { status: 401 }); }
  const admins = (process.env.PRINT_ADMIN_UIDS || '').split(',').map(v => v.trim());
  if (!admins.includes(actor.uid)) return NextResponse.json({ error: 'Printing approval is restricted.' }, { status: 403 });

  let data: { ownerUid?: string; albumId?: string; sku?: string; pageCount?: number;
    storagePath?: string; printArea?: string; preflightConfirmed?: boolean;
    assets?: BookManifest['assets'] };
  try { data = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid print approval.' }, { status: 400 }); }
  if (!data.ownerUid || !data.albumId || data.preflightConfirmed !== true ||
      !/^[a-zA-Z0-9_-]{1,128}$/.test(data.ownerUid) ||
      !/^[a-zA-Z0-9_-]{1,128}$/.test(data.albumId)) {
    return NextResponse.json({ error: 'Invalid album or owner.' }, { status: 400 });
  }
  try {
    const album = await getAlbumSummary(data.ownerUid, data.albumId);
    if (!album) return NextResponse.json({ error: 'Album must be saved before print approval.' }, { status: 404 });
    await assertHouseholdMember(data.ownerUid, album.childID);
    let assets = data.assets || [];
    if (data.storagePath) {
      const proof = await readProofObject(data.ownerUid, data.albumId, data.storagePath);
      if (proof.albumUpdatedAt !== album.updatedAt || proof.pageCount !== data.pageCount)
        throw new Error('Print proof is outdated or has a different page count.');
      // The currently supported browser proof size is 210 x 210 mm. Other
      // formats must be independently verified against their actual SKU.
      if (proof.widthMm !== 210 || proof.heightMm !== 210)
        throw new Error('This proof size has not been qualified for automatic approval.');
      assets = [{
        printArea: data.printArea || 'default',
        url: signedProofUrl(proof.storagePath, proof.generation),
        pageCount: proof.pageCount,
        storagePath: proof.storagePath,
        generation: proof.generation,
      }];
    }
    const manifest: BookManifest = {
      albumId: album.id,
      albumUpdatedAt: album.updatedAt,
      childID: album.childID,
      sku: data.sku || '',
      pageCount: data.pageCount || 0,
      assets,
      approved: true, approvedBy: actor.uid,
      approvedAt: new Date().toISOString(),
    };
    validateManifest(manifest);
    // The operator must verify PDF page layout, exact SKU and print area in a
    // sandbox sample first. Signing confirms this deliberate manual review.
    if (manifest.assets.some(asset => {
      try { return !new URL(asset.url).pathname.toLowerCase().endsWith('.pdf'); } catch { return true; }
    })) throw new Error('Only approved print-ready PDF assets are accepted.');
    manifest.signature = signApprovedManifest(data.ownerUid, manifest);
    const path = manifestPath(data.ownerUid, data.albumId);
    const prior = await readRecord<BookManifest>(path);
    if (prior) await replaceRecord(path, manifest, prior.updateTime);
    else await createRecord(path, manifest);
    return NextResponse.json({ approved: true, albumId: album.id }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Approval failed.' }, { status: 409 });
  }
}

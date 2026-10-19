import { NextResponse } from 'next/server';
import { assertHouseholdMember, createRecord, getAlbumSummary, readRecord, replaceRecord, verifiedUser } from '@/lib/server/commerce-store';
import { type BookManifest, manifestPath, validateManifest } from '@/lib/server/book-commerce';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  let actor;
  try { actor = await verifiedUser(request); }
  catch { return NextResponse.json({ error: 'Authentication required.' }, { status: 401 }); }
  const admins = (process.env.PRINT_ADMIN_UIDS || '').split(',').map(v => v.trim());
  if (!admins.includes(actor.uid)) return NextResponse.json({ error: 'Printing approval is restricted.' }, { status: 403 });

  let data: { ownerUid?: string; albumId?: string; sku?: string; pageCount?: number;
    assets?: BookManifest['assets'] };
  try { data = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid print approval.' }, { status: 400 }); }
  if (!data.ownerUid || !data.albumId ||
      !/^[a-zA-Z0-9_-]{1,128}$/.test(data.ownerUid) ||
      !/^[a-zA-Z0-9_-]{1,128}$/.test(data.albumId)) {
    return NextResponse.json({ error: 'Invalid album or owner.' }, { status: 400 });
  }
  try {
    const album = await getAlbumSummary(data.ownerUid, data.albumId);
    if (!album) return NextResponse.json({ error: 'Album must be saved before print approval.' }, { status: 404 });
    await assertHouseholdMember(data.ownerUid, album.childID);
    const manifest: BookManifest = {
      albumId: album.id,
      albumUpdatedAt: album.updatedAt,
      childID: album.childID,
      sku: data.sku || '',
      pageCount: data.pageCount || 0,
      assets: data.assets || [],
      approved: true, approvedBy: actor.uid,
      approvedAt: new Date().toISOString(),
    };
    validateManifest(manifest);
    // Prodigi can fetch HTTPS PDFs without session cookies. The trusted administrator
    // must verify the files, print dimensions and URL expiry before this approval.
    if (manifest.assets.some(asset => {
      try { return !new URL(asset.url).pathname.toLowerCase().endsWith('.pdf'); } catch { return true; }
    })) throw new Error('Only approved print-ready PDF assets are accepted.');
    const path = manifestPath(data.ownerUid, data.albumId);
    const prior = await readRecord<BookManifest>(path);
    if (prior) await replaceRecord(path, manifest, prior.updateTime);
    else await createRecord(path, manifest);
    return NextResponse.json({ approved: true, albumId: album.id }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Approval failed.' }, { status: 409 });
  }
}

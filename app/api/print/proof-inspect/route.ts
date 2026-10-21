import { NextResponse } from 'next/server';
import { verifiedUser } from '@/lib/server/commerce-store';
import { readProofObject, signedProofUrl } from '@/lib/server/gcs-print-proof';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let actor;
  try { actor = await verifiedUser(request); }
  catch { return NextResponse.json({ error: 'Authentication required.' }, { status: 401 }); }
  const admins = (process.env.PRINT_ADMIN_UIDS || '').split(',').map(v => v.trim()).filter(Boolean);
  if (!admins.includes(actor.uid)) {
    return NextResponse.json({ error: 'Print inspection is restricted.' }, { status: 403 });
  }
  try {
    const body = await request.json() as { ownerUid?: string; albumId?: string; storagePath?: string };
    if (!body.ownerUid || !body.albumId || !body.storagePath) {
      return NextResponse.json({ error: 'Missing proof reference.' }, { status: 400 });
    }
    const proof = await readProofObject(body.ownerUid, body.albumId, body.storagePath);
    return NextResponse.json({
      url: signedProofUrl(proof.storagePath, proof.generation, 15 * 60),
      size: proof.size, pageCount: proof.pageCount,
      widthMm: proof.widthMm, heightMm: proof.heightMm,
      albumUpdatedAt: proof.albumUpdatedAt,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'Private proof could not be inspected.' }, { status: 409 });
  }
}

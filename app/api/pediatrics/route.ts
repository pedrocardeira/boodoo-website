import { NextRequest,NextResponse } from 'next/server';
import { firebaseWebConfig } from '@/lib/v2/firebase-public-config';
import { isPortalRequest, portalResponse } from '@/lib/pediatrics/portal-policy';
export const dynamic='force-dynamic';
export async function POST(request:NextRequest){
  const headers={'Cache-Control':'no-store'};
  const previewOnly=process.env.VERCEL_ENV!=='production'&&(process.env.VERCEL_GIT_COMMIT_REF==='codex/website-preview'||process.env.VERCEL_URL?.includes('codex-website-')===true);
  if(process.env.VERCEL_ENV==='production'||(process.env.BOODOO_PEDIATRICS_PORTAL_ENABLED!=='true'&&!previewOnly))return NextResponse.json({error:'portal_disabled'},{status:404,headers});
  const authorization=request.headers.get('authorization');
  if(!authorization?.match(/^Bearer [A-Za-z0-9_.-]+$/))return NextResponse.json({error:'authentication_required'},{status:401,headers});
  try{
    const raw=await request.text();
    if(Buffer.byteLength(raw)>32768)return NextResponse.json({error:'request_too_large'},{status:413,headers});
    let input:unknown;
    try{input=JSON.parse(raw);}catch{return NextResponse.json({error:'invalid_request'},{status:400,headers});}
    if(!isPortalRequest(input))return NextResponse.json({error:'action_not_available'},{status:403,headers});
    // The professional portal is only enabled on Vercel Preview while the
    // sandbox is being exercised. Pin that path to the isolated Firebase
    // project so a stale Preview variable can never route this request to the
    // production project (or another non-production project).
    // Vercel preview deployments can expose a branch-specific environment
    // without setting VERCEL_ENV to the literal string "preview". Reuse the
    // same non-production gate as above so every explicitly enabled preview
    // is pinned to the isolated Pediatrics sandbox.
    const sandboxPreview=previewOnly&&process.env.BOODOO_PEDIATRICS_PORTAL_ENABLED==='true';
    const project=sandboxPreview?'boodoo-pediatrics-sandbox':firebaseWebConfig.projectId;
    if(!project||!/^[a-z0-9-]+$/.test(project))return NextResponse.json({error:'service_not_configured'},{status:503,headers});
    const response=await fetch(`https://europe-west1-${project}.cloudfunctions.net/pediatricCare`,{
      method:'POST',headers:{Authorization:authorization,'Content-Type':'application/json'},body:JSON.stringify(input),cache:'no-store',signal:AbortSignal.timeout(25000)
    });
    const body=await response.json();
    return NextResponse.json(portalResponse(input.action,body),{status:response.status,headers});
  }catch{return NextResponse.json({error:'service_unavailable'},{status:503,headers});}
}

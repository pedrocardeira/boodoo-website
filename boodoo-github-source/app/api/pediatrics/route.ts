import { NextRequest,NextResponse } from 'next/server';
import { firebaseWebConfig } from '@/lib/v2/firebase-public-config';
import { isPortalRequest, portalResponse } from '@/lib/pediatrics/portal-policy';
export const dynamic='force-dynamic';
export async function POST(request:NextRequest){
  const headers={'Cache-Control':'no-store'};
  const previewHost=request.nextUrl.hostname.endsWith('.vercel.app')&&request.nextUrl.hostname.includes('boodoo-website-');
  const previewOnly=process.env.VERCEL_ENV!=='production'||previewHost;
  const portalEnabled=process.env.BOODOO_PEDIATRICS_PORTAL_ENABLED==='true';
  if(!portalEnabled||!previewOnly)return NextResponse.json({error:'portal_disabled'},{status:404,headers});
  const authorization=request.headers.get('authorization');
  if(!authorization?.match(/^Bearer [A-Za-z0-9_.-]+$/))return NextResponse.json({error:'authentication_required'},{status:401,headers});
  try{
    const raw=await request.text();
    if(Buffer.byteLength(raw)>32768)return NextResponse.json({error:'request_too_large'},{status:413,headers});
    let input:unknown;
    try{input=JSON.parse(raw);}catch{return NextResponse.json({error:'invalid_request'},{status:400,headers});}
    if(!isPortalRequest(input))return NextResponse.json({error:'action_not_available'},{status:403,headers});
    // Preview portal requests are pinned to the isolated Pediatrics project.
    // The Vercel environment label can be production for branch deployments,
    // so the temporary *.vercel.app host is part of the sandbox gate.
    const sandboxPreview=previewOnly&&portalEnabled;
    const project=sandboxPreview?'boodoo-pediatrics-sandbox':firebaseWebConfig.projectId;
    if(!project||!/^[a-z0-9-]+$/.test(project))return NextResponse.json({error:'service_not_configured'},{status:503,headers});
    const response=await fetch(`https://europe-west1-${project}.cloudfunctions.net/pediatricCare`,{
      method:'POST',headers:{Authorization:authorization,'Content-Type':'application/json'},body:JSON.stringify(input),cache:'no-store',signal:AbortSignal.timeout(25000)
    });
    const body=await response.json();
    return NextResponse.json(portalResponse(input.action,body),{status:response.status,headers});
  }catch{return NextResponse.json({error:'service_unavailable'},{status:503,headers});}
}

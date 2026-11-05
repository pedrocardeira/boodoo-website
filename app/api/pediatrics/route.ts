import { NextRequest,NextResponse } from 'next/server';
import { firebaseWebConfig } from '@/lib/v2/firebase-public-config';
export const dynamic='force-dynamic';
const actions=new Set(['status','profile','register','saveOffer','setAvailability','patients','medicalRecords','reviewQueue','review']);
export async function POST(request:NextRequest){
  const headers={'Cache-Control':'no-store'};
  if(process.env.VERCEL_ENV==='production'||process.env.BOODOO_PEDIATRICS_PORTAL_ENABLED!=='true')return NextResponse.json({error:'portal_disabled'},{status:404,headers});
  const authorization=request.headers.get('authorization');
  if(!authorization?.match(/^Bearer [A-Za-z0-9_.-]+$/))return NextResponse.json({error:'authentication_required'},{status:401,headers});
  try{
    const raw=await request.text();
    if(Buffer.byteLength(raw)>32768)return NextResponse.json({error:'request_too_large'},{status:413,headers});
    const input=JSON.parse(raw);
    if(!input||!actions.has(input.action))return NextResponse.json({error:'unknown_action'},{status:400,headers});
    const project=firebaseWebConfig.projectId;
    if(!project||!/^[a-z0-9-]+$/.test(project))return NextResponse.json({error:'service_not_configured'},{status:503,headers});
    const response=await fetch(`https://europe-west1-${project}.cloudfunctions.net/pediatricCare`,{
      method:'POST',headers:{Authorization:authorization,'Content-Type':'application/json'},body:JSON.stringify(input),cache:'no-store',signal:AbortSignal.timeout(25000)
    });
    const body=await response.json();
    return NextResponse.json(body,{status:response.status,headers});
  }catch{return NextResponse.json({error:'service_unavailable'},{status:503,headers});}
}

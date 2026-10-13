import { NextResponse } from 'next/server';
import { quoteProductionCost,validatePrintRequest } from '@/lib/v2/print-provider';
export const runtime='nodejs';
export async function POST(request:Request){
 const apiKey=process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
 const admins=(process.env.PRINT_ADMIN_UIDS||'').split(',').map(s=>s.trim()).filter(Boolean);
 if(!apiKey||!admins.length)return NextResponse.json({error:'Supplier evaluation is not configured.'},{status:503});
 const token=request.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1];
 if(!token)return NextResponse.json({error:'Authentication required.'},{status:401});
 try{
 const account=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:token}),cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(!account.ok)return NextResponse.json({error:'Invalid session.'},{status:401});
 const identity=await account.json();if(!admins.includes(identity.users?.[0]?.localId))return NextResponse.json({error:'Supplier evaluation is restricted to configured administrators.'},{status:403});
 let input;try{input=validatePrintRequest(await request.json());}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Invalid request.'},{status:400});}
 const quote=await quoteProductionCost(input);return NextResponse.json(quote,{headers:{'Cache-Control':'private, no-store'}});
 }catch{return NextResponse.json({error:'Supplier quote unavailable. No order was placed.'},{status:502});}
}

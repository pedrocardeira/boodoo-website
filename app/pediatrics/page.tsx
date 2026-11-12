import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PediatricsPortal from '@/components/pediatrics/portal';
export const metadata:Metadata={title:'BooDoo Pediatrics · Professional portal',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
function SandboxNotice(){
  return <main id="main" style={{minHeight:'100vh',padding:'48px 24px',fontFamily:'Arial,sans-serif',background:'#f4f5f1',color:'#1d3533'}}>
    <section style={{maxWidth:720,margin:'0 auto',background:'#fff',border:'1px solid #dde3d9',borderRadius:20,padding:32}}>
      <p style={{letterSpacing:'.12em',textTransform:'uppercase',fontSize:12}}>BooDoo Pediatrics · Preview</p>
      <h1 style={{fontFamily:'Georgia,serif'}}>Create the Firebase sandbox first.</h1>
      <p>This preview is intentionally disconnected from the production BooDoo project. No professional sign-in, document upload or medical record can run until a separate Firebase project is configured.</p>
      <p>Configure the preview with its own Firebase Web app, Email/Password Authentication, Firestore, Storage and the <code>pediatricCare</code> function. Then enable <code>BOODOO_PEDIATRICS_PORTAL_ENABLED=true</code> only for the Vercel preview.</p>
    </section>
  </main>;
}
export default function Page(){
  const previewOnly=process.env.VERCEL_ENV!=='production'&&(process.env.VERCEL_GIT_COMMIT_REF==='codex/website-preview'||process.env.VERCEL_URL?.includes('codex-website-')===true);
  if(process.env.VERCEL_ENV==='production'||(process.env.BOODOO_PEDIATRICS_PORTAL_ENABLED!=='true'&&!previewOnly))notFound();
  const sandboxReady=Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID&&process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!=='boodoo-e5d55'&&process.env.BOODOO_PEDIATRICS_PORTAL_ENABLED==='true');
  if(previewOnly&&!sandboxReady)return <SandboxNotice/>;
  return <PediatricsPortal/>;
}

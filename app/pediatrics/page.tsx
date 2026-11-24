import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PediatricsPortal from '@/components/pediatrics/portal';
export const metadata:Metadata={title:'BooDoo Pediatrics · Professional portal',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default function Page(){
  // Keep the public deployment closed while allowing this explicitly isolated
  // sandbox branch to work even when Vercel has not copied the preview flag
  // into a newly-created deployment yet.
  const isolatedPreview=process.env.VERCEL_ENV==='preview'&&process.env.VERCEL_GIT_COMMIT_REF==='codex/126-pediatrics-consent-only';
  if(process.env.VERCEL_ENV==='production'||(process.env.BOODOO_PEDIATRICS_PORTAL_ENABLED!=='true'&&!isolatedPreview))notFound();
  return <PediatricsPortal/>;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PediatricsPortal from '@/components/pediatrics/portal';
export const metadata:Metadata={title:'BooDoo Pediatrics · Professional portal',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default function Page(){
  // This is a preview-only professional workspace. Production is the hard
  // boundary; preview deployments must not depend on a copied Vercel flag.
  if(process.env.VERCEL_ENV==='production')notFound();
  return <PediatricsPortal/>;
}

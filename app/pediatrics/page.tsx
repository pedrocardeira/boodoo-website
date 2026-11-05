import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PediatricsPortal from '@/components/pediatrics/portal';
export const metadata:Metadata={title:'BooDoo Pediatrics · Professional portal',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default function Page(){
  if(process.env.VERCEL_ENV==='production'||process.env.BOODOO_PEDIATRICS_PORTAL_ENABLED!=='true')notFound();
  return <PediatricsPortal/>;
}

import { Suspense } from 'react';
import type { Metadata } from 'next';
import FamilySpace from '@/components/v2/family-space';
export const metadata:Metadata={title:'Your family space | Boodoo',robots:{index:false,follow:false}};
export default function Page(){return <Suspense fallback={<div className="boodoo-v2 loading-screen">Opening your family space…</div>}><FamilySpace/></Suspense>}

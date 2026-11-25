import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PediatricsAdmin from '@/components/pediatrics/admin';

export const metadata: Metadata = { title: 'BooDoo · Administration', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  // Administration is preview-only until the owner explicitly authorizes a
  // production release. The API repeats this boundary server-side.
  if (process.env.VERCEL_ENV === 'production') notFound();
  return <PediatricsAdmin />;
}

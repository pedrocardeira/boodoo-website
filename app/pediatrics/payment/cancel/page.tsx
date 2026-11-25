import Link from 'next/link';
import type { Metadata } from 'next';
import { Header, Footer } from '@/components/v2/header';

export const metadata: Metadata = {
  title: 'Consultation checkout cancelled | BooDoo',
  robots: { index: false, follow: false },
};

export default function PediatricsPaymentCancel() {
  return <div className="boodoo-v2"><Header/><main id="main"><section className="page-intro">
    <span className="eyebrow">BOODOO PEDIATRICS</span>
    <h1>Checkout was not completed.</h1>
    <p>No consultation was confirmed. The family app can retry while the reservation is still within its hold window.</p>
    <div className="button-row"><Link className="v2-button" href="/pediatrics">Return to Pediatrics</Link><Link className="text-link" href="/family">Open BooDoo family space</Link></div>
  </section></main><Footer/></div>;
}

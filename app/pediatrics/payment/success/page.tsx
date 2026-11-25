import Link from 'next/link';
import type { Metadata } from 'next';
import { Header, Footer } from '@/components/v2/header';

export const metadata: Metadata = {
  title: 'Consultation payment received | BooDoo',
  robots: { index: false, follow: false },
};

export default function PediatricsPaymentSuccess() {
  return <div className="boodoo-v2"><Header/><main id="main"><section className="page-intro">
    <span className="eyebrow">BOODOO PEDIATRICS</span>
    <h1>Payment submitted.</h1>
    <p>Stripe sent you back to BooDoo. The server verifies the payment webhook before confirming the consultation. The family app and the pediatrician portal will show the updated status after that verification.</p>
    <p>For a video consultation, both participants enter the same protected browser room from their own device. This page does not start a call by itself.</p>
    <div className="button-row"><Link className="v2-button" href="/pediatrics">Return to Pediatrics</Link><Link className="text-link" href="/family">Open BooDoo family space</Link></div>
  </section></main><Footer/></div>;
}

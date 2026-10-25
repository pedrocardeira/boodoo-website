import Link from 'next/link';
import ReturnToBooDoo from '../return-to-app';
import { Header, Footer } from '@/components/v2/header';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Checkout cancelled | BooDoo', robots: { index: false, follow: false } };

export default function BookPaymentCancel() {
  return <div className="boodoo-v2"><Header/><main id="main"><section className="page-intro">
    <span className="eyebrow">BOODOO PHOTO BOOKS</span>
    <h1>Checkout was not completed.</h1>
    <p>You returned from Stripe without completing this checkout. Your book is still available in BooDoo.</p>
    <ReturnToBooDoo result="cancel"/>
    <div className="button-row"><Link className="v2-button" href="/family?view=albums">Back to my books</Link><Link className="text-link" href="/albums">About BooDoo books</Link></div>
  </section></main><Footer/></div>;
}

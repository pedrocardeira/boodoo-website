import ReturnToBooDoo from '../return-to-app';
import Link from 'next/link';
import { Header, Footer } from '@/components/v2/header';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Payment received | BooDoo', robots: { index: false, follow: false } };

export default function BookPaymentSuccess() {
  return <div className="boodoo-v2"><Header/><main id="main"><section className="page-intro">
    <span className="eyebrow">BOODOO PHOTO BOOKS</span>
    <h1>Thank you for your payment.</h1>
    <p>Stripe has redirected you back to BooDoo. Your book order is being confirmed. Please check your order status in the BooDoo app before assuming printing has started.</p>
    <p>If you used Stripe Sandbox, this was a test payment and no real charge was made.</p>
    <ReturnToBooDoo result="success"/><div className="button-row"><Link className="v2-button" href="/family?view=albums">View my books</Link><Link className="text-link" href="/albums">About BooDoo books</Link></div>
  </section></main><Footer/></div>;
}

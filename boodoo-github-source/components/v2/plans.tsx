'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, History, BarChart3, Bell, Palette } from 'lucide-react';
import { appStoreUrl, euro, freeFeatures, proFeatures, proPrices } from '@/lib/v2/plans';

export function PlanCards() {
  const [billing, setBilling] = useState<'yearly' | 'monthly'>('yearly');
  const yearly = billing === 'yearly';
  return <section className="plans-section" aria-label="BooDoo subscription plans">
    <div className="billing-switch" role="group" aria-label="Pro billing period">
      <button aria-pressed={!yearly} onClick={() => setBilling('monthly')}>Monthly</button>
      <button aria-pressed={yearly} onClick={() => setBilling('yearly')}>Yearly <span>Save 25%</span></button>
    </div>
    <p className="billing-caption">The same Pro features, whichever billing period you choose.</p>
    <div className="plan-grid">
      <article className="plan-card">
        <span className="eyebrow">EVERYDAY CARE</span>
        <h2>BooDoo Free</h2>
        <p className="plan-description">Keep their day together.<br/>Start their story.</p>
        <div className="plan-price"><strong>€0</strong><span>no subscription</span></div>
        <p className="plan-billing">Start with the daily essentials.</p>
        <a className="v2-button outline" href={appStoreUrl}>Get BooDoo free <ArrowUpRight size={18}/></a>
        <h3>Your everyday toolkit</h3>
        <ul className="plan-features">{freeFeatures.map(feature => <li key={feature}><Check size={18}/><span>{feature}</span></li>)}</ul>
      </article>
      <article className="plan-card pro-plan">
        <span className="eyebrow">MORE CONTEXT. MORE PERSONAL.</span>
        <h2>BooDoo Pro</h2>
        <p className="plan-description">Look back with clarity.<br/>Plan their day your way.</p>
        <div className="plan-price" aria-live="polite" aria-atomic="true"><strong>{euro(yearly ? proPrices.yearly : proPrices.monthly)}</strong><span>/ {yearly ? 'year' : 'month'}</span></div>
        <p className="plan-billing">{yearly ? `Billed ${euro(proPrices.yearly)} yearly · about ${euro(proPrices.yearly / 12)} per month.` : `Billed ${euro(proPrices.monthly)} monthly.`}</p>
        <a className="v2-button" href={appStoreUrl}>Explore Pro in the app <ArrowUpRight size={18}/></a>
        <h3>Everything in Free, plus</h3>
        <ul className="plan-features">{proFeatures.map(feature => <li key={feature}><Check size={18}/><span>{feature}</span></li>)}</ul>
        <Link href="#next-update" className="plan-next">See what’s coming to Pro <ArrowRight size={16}/></Link>
      </article>
    </div>
    <p className="plan-terms">Prices shown in euros. Regional pricing and subscription terms are confirmed in the App Store before purchase. Subscriptions renew automatically unless cancelled in your Apple account.</p>
  </section>;
}

const reasons = [
  { icon: History, title: 'The days behind today.', text: 'Revisit your full care history when a single day doesn’t tell the whole story.' },
  { icon: BarChart3, title: 'Details you can understand.', text: 'Use reports and averages to put the feeding, sleep and daily care you log into context.' },
  { icon: Bell, title: 'A rhythm that fits their day.', text: 'Choose feeding intervals and feed and sleep alerts that support your routine.' },
  { icon: Palette, title: 'A space that feels like yours.', text: 'Choose your colors and theme around the photos and memories that make BooDoo personal.' },
];

export function ProBenefit() {
  return <section className="v2-section pro-benefit" id="pricing">
    <div className="pro-heading"><div><span className="eyebrow">BOODOO PRO</span><h2>Make more of<br/><em>every day you log.</em></h2><p>More history to look back on. More context for the changes you notice. More control over the routine that works for your family.</p></div><div className="pro-price-note"><strong>{euro(proPrices.monthly)}<small>/ month</small></strong><span>or {euro(proPrices.yearly)} billed yearly</span><Link href="/pricing" className="v2-button">Compare Free & Pro <ArrowRight size={18}/></Link></div></div>
    <div className="pro-reasons">{reasons.map(reason => <article key={reason.title}><reason.icon size={25}/><h3>{reason.title}</h3><p>{reason.text}</p></article>)}</div>
    <div className="next-update-teaser"><span className="release-label">NEXT APP UPDATE</span><p>Pro is getting editable sleep plans, reviews, period comparisons, appointment summaries, memory recaps and digital book exports.</p><Link href="/pricing#next-update">Explore the upcoming tools <ArrowRight size={17}/></Link></div>
  </section>;
}

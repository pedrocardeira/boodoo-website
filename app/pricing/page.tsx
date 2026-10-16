import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Header, Footer } from '@/components/v2/header';
import { PlanCards } from '@/components/v2/plans';
import { nextUpdateFeatures, priceSourceUrl } from '@/lib/v2/plans';

export const metadata: Metadata = {
  title: 'BooDoo pricing | Free daily tracking & BooDoo Pro',
  description: 'Start with free daily care tracking, pregnancy tools and memories. BooDoo Pro adds full history, reports, custom routines and personal themes. €1.99 monthly or €17.99 yearly.',
  alternates: { canonical: '/pricing' },
};

export default function Pricing() {
  return <div className="boodoo-v2"><Header/><main id="main">
    <section className="page-intro pricing-intro"><span className="eyebrow">YOUR FAMILY. YOUR CHOICE.</span><h1>Start with their day.<br/><em>See more with Pro.</em></h1><p>Quick daily logging, meaningful memories, and a space that adapts from pregnancy to childhood. Choose Pro for more history, clearer reports and a routine you can make your own.</p></section>
    <PlanCards/>
    <section className="v2-section shared-insights"><Sparkles size={30}/><div><span className="eyebrow">ASK BOODOO</span><h2>Your records deserve<br/><em>more than a glance.</em></h2><p>Ask about the feeds, naps and changes you’ve logged, in your own words. Ask BooDoo uses your child’s records as context to help you understand their day. It is available without a Pro subscription; usage availability is shown in the app.</p><Link href="/#ask-boodoo" className="text-link">See Ask BooDoo in action <ArrowRight size={17}/></Link></div></section>
    <section className="v2-section upcoming-tools" id="next-update" aria-labelledby="upcoming-title">
      <div className="section-heading"><span className="release-label">COMING IN THE NEXT APP UPDATE · PRO</span><h2 id="upcoming-title">Understand the changes.<br/><em>Keep the story.</em></h2><p>A preview of the new Pro tools. These features are not yet in the App Store release.</p></div>
      <div className="upcoming-grid">{nextUpdateFeatures.map((feature, i) => <article key={feature.label}><span className="upcoming-number">0{i + 1}</span><span className="eyebrow">{feature.label.toUpperCase()}</span><h3>{feature.title}</h3><p>{feature.description}</p></article>)}</div>
      <p className="quiet-note">Sleep plans and reviews are created when you choose and depend on the records available. Sleep times are estimates that you can adjust to your child’s cues. Digital books are personal keepsakes; printed books and print-ready files are not included.</p>
    </section>
    <section className="v2-section pregnancy-update"><div><span className="release-label">NEXT APP UPDATE · FREE</span><h2>A little less to remember.<br/><em>More room for you.</em></h2><p>Your pregnancy already has its own space for appointments, feelings, sleep, symptoms, preparation and memories. The next update makes it easier to keep that story up to date.</p></div><ul><li><strong>Plans can change.</strong><span>Edit and reschedule appointments, keeping their notes and completion status.</span></li><li><strong>A reminder when you need it.</strong><span>Choose an optional reminder for each pregnancy appointment.</span></li><li><strong>Keep the memory just right.</strong><span>Edit a pregnancy memory’s words, date or photograph.</span></li></ul></section>
    <section className="v2-section pricing-faq"><div className="feature-faq"><h2>A few things before you choose.</h2>
      <details><summary>Can I use BooDoo without subscribing?</summary><p>Yes. Free includes daily feeding, sleep and diaper logging, today’s overview, pregnancy tools, photos and Moments. Pro adds full care history, reports, sharing with multiple caregivers, custom routine settings and themes.</p></details>
      <details><summary>Do monthly and yearly Pro include the same features?</summary><p>Yes. Choose €1.99 billed monthly or €17.99 billed yearly. The annual plan works out at approximately €1.50 per month and saves about 25% compared with twelve monthly payments. Prices vary by country; your App Store displays the final local price.</p></details>
      <details><summary>How do I subscribe or cancel?</summary><p>Open BooDoo and choose Pro. Apple handles payment and shows the renewal terms before you confirm. You can manage or cancel the subscription through your Apple account’s subscription settings.</p></details>
      <details><summary>Are the upcoming tools available now?</summary><p>No. The sleep planner, reviews, comparisons, appointment preparation, memory recaps, digital book exports and pregnancy editing tools shown above are planned for the next app update. Choose your subscription based on the features available in the current release.</p></details>
      <details><summary>Can I use it with another parent or caregiver?</summary><p>Creating and managing QR sharing requires a registered Pro account for the family owner. Invited caregivers can connect to that Pro family using the free app, without buying another subscription. Pregnancy wellbeing entries, appointment history and the upcoming review drafts and sleep plans are kept on the device; they are not currently shared across devices.</p></details>
      <details><summary>Will the sleep planner include a specialist consultation?</summary><p>The upcoming planner uses your chosen times and available sleep records, with editable estimates and links to guidance from the NHS and Pediatric Sleep Council. Individual specialist reviews are not included or available to book through BooDoo yet.</p></details>
      <details><summary>Is a printed photo book included in Pro?</summary><p>No. The website album studio is available as a preview, with editable layouts, photographs, captions and spreads. Printed ordering is not available yet. The upcoming Pro PDF export is a digital keepsake, not a print proof.</p><Link href="/albums" className="text-link">Explore the album studio <ArrowRight size={16}/></Link></details>
      <details><summary>Does BooDoo replace advice from a healthcare professional?</summary><p>No. BooDoo helps you keep records and understand everyday patterns. Reviews and Ask BooDoo depend on what you log and do not diagnose conditions or replace professional care.</p></details>
    </div><p className="pricing-source">Euro subscription prices checked against the <a href={priceSourceUrl} target="_blank" rel="noreferrer">App Store listing</a> on 15 October 2026.</p></section>
  </main><Footer/></div>;
}

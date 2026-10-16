import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, BookOpen, Heart, Sparkles } from 'lucide-react';
import { Header, Footer } from '@/components/v2/header';

const description = 'Compare BooDoo with Huckleberry, Qeepsake, FamilyAlbum and Mixbook. Find the right fit for daily care, insights, pregnancy and family memories.';
export const metadata: Metadata = {
  title: 'BooDoo compared | Baby tracking, insights & memory books',
  description,
  alternates: { canonical: '/compare' },
  openGraph: {
    title: 'Why BooDoo? Daily care, insights and their personal story',
    description,
    url: 'https://www.boodoo.app/compare',
    type: 'website',
  },
};

const reasons = [
  { icon: Heart, title: 'Keep the day together.', copy: 'Log feeds, breastfeeding, pumped milk, sleep and diapers from the main screen. Keep care, growth and milestones in the same child’s profile.' },
  { icon: Sparkles, title: 'Make sense of your records.', copy: 'Ask BooDoo about the details you have logged. Explore patterns, changes and routines with your child’s own records as context.' },
  { icon: BookOpen, title: 'Keep more than the numbers.', copy: 'Photos, a few words and little firsts build a personal daily book. Pregnancy, baby and toddler stages bring different tools into focus.' },
];

const alternatives = [
  {
    name: 'Huckleberry',
    url: 'https://huckleberrycare.com/pricing',
    strength: 'Daily tracking and reports, with SweetSpot nap predictions, data-based insights and expert-designed sleep plans on paid memberships.',
    boodoo: 'Choose BooDoo when you want feeding, sleep and care connected with development, personal photos and a daily journal. Ask BooDoo helps you explore your logs. Editable nap and bedtime plans are coming in the next Pro update; individual specialist consultations are not included.',
  },
  {
    name: 'Qeepsake',
    url: 'https://qeepsake.com/features/',
    strength: 'Scheduled text prompts, photo journals and customizable printed books. Family contributors are available with its Premium membership.',
    boodoo: 'Choose BooDoo when memories are part of your everyday care routine. Save photos and words alongside milestones, then arrange a chapter in the web studio preview. Text-message journaling is not included.',
  },
  {
    name: 'FamilyAlbum',
    url: 'https://family-album.com/',
    strength: 'Private photo and video sharing, monthly organization, family comments and reactions, plus prints and photobooks.',
    boodoo: 'Choose BooDoo when sharing also means knowing the last feed, sleep or care entry. A Pro family owner can connect invited caregivers, who can use Free, to shared child records across Apple devices and keep personal memories together.',
  },
  {
    name: 'Mixbook',
    url: 'https://www.mixbook.com/studio',
    strength: 'A dedicated photo-book service with Auto-Create, customizable layouts, two-page spreads, collaborative editing and printed ordering.',
    boodoo: 'Choose BooDoo to start a book from the Moments you already keep. The web studio preview offers 1–4-photo layouts, editable captions, individual photo framing and double-page spreads. Printed ordering is not available yet.',
  },
];

export default function Compare() {
  return (
    <div className="boodoo-v2">
      <Header />
      <main id="main">
        <section className="page-intro">
          <span className="eyebrow">WHY FAMILIES CHOOSE BOODOO</span>
          <h1>The care you log.<br /><em>The story you keep.</em></h1>
          <p>BooDoo brings quick daily tracking, insights from your records and personal memories together. One place to understand their day and remember it.</p>
          <div className="button-row">
            <Link className="v2-button" href="/pricing">Explore Free &amp; Pro <ArrowRight size={17} /></Link>
            <Link className="text-link" href="/#feature-guide">See the app features <ArrowRight size={17} /></Link>
          </div>
        </section>

        <section className="comparison-wrap" aria-labelledby="boodoo-reasons">
          <h2 id="boodoo-reasons">Useful today. Personal for years.</h2>
          <div className="feature-grid">
            {reasons.map(({ icon: Icon, title, copy }) => (
              <article className="feature-tile" key={title}>
                <Icon size={26} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>

          <h2>Find the fit for your family.</h2>
          <p>Each app has strengths. This comparison focuses on what you want to do, so you can choose the tools that matter to you.</p>
          <div className="comparison-scroll">
            <table className="comparison-table">
              <caption className="quiet-note">Selected capabilities, checked against the official product pages linked in each row.</caption>
              <thead>
                <tr>
                  <th scope="col">Alternative</th>
                  <th scope="col">What it offers</th>
                  <th scope="col">Why consider BooDoo</th>
                </tr>
              </thead>
              <tbody>
                {alternatives.map(({ name, url, strength, boodoo }) => (
                  <tr key={name}>
                    <th scope="row"><a href={url} target="_blank" rel="noreferrer">{name} ↗</a></th>
                    <td>{strength}</td>
                    <td>{boodoo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="quiet-note">Reviewed October 15, 2026. Published by BooDoo. This is a selected feature comparison; availability can depend on plan, age, device and country.</p>

          <h2>Start with the app. Explore the book studio.</h2>
          <p>The BooDoo iPhone and iPad app is where you log daily care, use Ask BooDoo and save Moments. Free and Pro include different tools, with the details on our pricing page.</p>
          <div className="scope-note">
            <strong>The website’s album studio is a preview.</strong><br />
            Try photo layouts, crops, captions, page order and two-page spreads, then save your draft. Demo changes stay in your browser. Printed ordering is unavailable, and a personal preview is not a print proof.
          </div>
          <div className="button-row">
            <Link className="v2-button" href="/pricing">Find your BooDoo plan <ArrowRight size={17} /></Link>
            <Link className="v2-button outline" href="/family?demo=1&view=albums">Try the book studio <ArrowRight size={17} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

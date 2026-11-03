import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Download, ExternalLink } from "lucide-react";
import AppStoreLink from "../../components/AppStoreLink";

const title = "Best Baby Tracker Apps: 5 Honest Options Compared";
const description =
  "Compare BooDoo, Huckleberry, Nara Baby, Baby Tracker and Glow Baby for feeding, sleep, diaper and growth tracking.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/best-baby-tracker-apps"
  },
  openGraph: {
    title,
    description,
    url: "https://www.boodoo.app/best-baby-tracker-apps",
    type: "article",
    images: ["/screenshots/01-dashboard-photo-sources.png"]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/screenshots/01-dashboard-photo-sources.png"]
  }
};

const apps = [
  {
    name: "BooDoo",
    bestFor: "Clear daily tracking with visible medical sources",
    platforms: "iPhone and iPad",
    free: "Free download; optional Pro",
    strengths: [
      "Feeds, sleep, awake time, diapers and growth together",
      "Age-adapted educational context with visible sources",
      "Focused, calm dashboard and daily goals"
    ],
    consider: "No Android version and fewer specialist sleep-coaching tools than larger platforms.",
    href: "https://apps.apple.com/us/app/boodoo/id6784456363",
    sourceLabel: "View BooDoo"
  },
  {
    name: "Huckleberry",
    bestFor: "Sleep predictions and paid sleep support",
    platforms: "iOS and Android",
    free: "Free tracking tier; optional Plus and Premium",
    strengths: [
      "Tracks sleep, feeding, pumping, diapers and more",
      "Reports and caregiver synchronization in the free tier",
      "Paid SweetSpot predictions, insights and sleep plans"
    ],
    consider: "Its most distinctive prediction and coaching tools require a paid membership.",
    href: "https://huckleberrycare.com/pricing",
    sourceLabel: "Official plans"
  },
  {
    name: "Nara Baby",
    bestFor: "Free family coordination and parent wellbeing",
    platforms: "iPhone and Apple Watch",
    free: "Free and advertised as ad-free",
    strengths: [
      "Baby, pregnancy and postpartum tracking",
      "Caregiver sharing and multiple-child support",
      "Feeding, sleep, diapers, growth and routines"
    ],
    consider: "Its broader parent-and-baby scope may be more than someone seeking a compact tracker needs.",
    href: "https://apps.apple.com/us/app/nara-baby-pregnancy-tracker/id1444639029",
    sourceLabel: "Official App Store listing"
  },
  {
    name: "Baby Tracker by Nighp",
    bestFor: "Traditional logging across iOS and Android",
    platforms: "iPhone, iPad and Android",
    free: "Check the current store listing",
    strengths: [
      "Established activity logging workflow",
      "Daily, weekly and monthly reports",
      "Automatic synchronization for family use"
    ],
    consider: "The interface takes a more traditional log-and-chart approach than newer explanation-led trackers.",
    href: "https://www.nighp.com/",
    sourceLabel: "Official developer site"
  },
  {
    name: "Glow Baby",
    bestFor: "Community, content and a wider parenting ecosystem",
    platforms: "iOS and Android",
    free: "Free download; optional Premium",
    strengths: [
      "Feeding, pumping, sleep, diapers and milestones",
      "Charts, customized insights and parenting content",
      "Built-in parent community and multiple children"
    ],
    consider: "Parents who only want a quiet tracker may not need the community and content layers.",
    href: "https://wp.glowing.com/glow-baby-app",
    sourceLabel: "Official product page"
  }
];

const faq = [
  {
    question: "Which baby tracker app is best for simple daily logging?",
    answer:
      "BooDoo, Nara Baby and Baby Tracker all emphasize quick everyday logging. The best choice is the one whose feed, sleep and diaper controls still feel easy during a tired night."
  },
  {
    question: "Which app is best for sleep predictions?",
    answer:
      "Huckleberry is the clearest specialist choice in this comparison for paid sleep predictions and expert-designed sleep plans."
  },
  {
    question: "Is there a free baby tracker app?",
    answer:
      "Yes. Every product in this comparison has a free starting point or free download, although advanced tools and current regional prices vary. Check the current store listing before choosing."
  },
  {
    question: "Can a baby tracker replace medical advice?",
    answer:
      "No. A tracker can organize information and help you explain patterns, but medical concerns should always be discussed with a qualified healthcare professional."
  }
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "BooDoo",
        item: "https://www.boodoo.app/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Best baby tracker apps",
        item: "https://www.boodoo.app/best-baby-tracker-apps"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: "2025-08-12",
    dateModified: "2025-08-12",
    author: {
      "@type": "Person",
      name: "José Cardeira"
    },
    publisher: {
      "@type": "Organization",
      name: "BooDoo"
    },
    mainEntityOfPage: "https://www.boodoo.app/best-baby-tracker-apps"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  }
];

export default function BestBabyTrackerAppsPage() {
  return (
    <main className="min-h-screen bg-[#f7f6f4] text-[#30303d]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
        }}
      />

      <header className="border-b border-white/70 bg-[#f7f6f4]/90 backdrop-blur-2xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="BooDoo home">
            <Image src="/icons/boodoo-icon.png" alt="" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-black">BooDoo</span>
          </Link>
          <AppStoreLink
            location="best_apps_header"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ff5865] px-5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(255,88,101,0.28)] transition hover:bg-[#e24752]"
          >
            <Download size={17} aria-hidden="true" />
            Download
          </AppStoreLink>
        </nav>
      </header>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(255,88,101,0.18),transparent_30%),linear-gradient(180deg,#fff_0%,#f7f6f4_92%)] py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="inline-flex rounded-full border border-[#ffd9dd] bg-white/85 px-4 py-2 text-sm font-extrabold text-[#ff5865] shadow-sm">
            Updated 12 August 2025
          </p>
          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            Best Baby Tracker Apps: 5 Honest Options Compared
          </h1>
          <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-[#696875] sm:text-xl">
            The right tracker is the one you can use consistently when you are tired. We compared five popular approaches to feeding, sleep, diaper and growth tracking—and explain where BooDoo fits.
          </p>
          <div className="mt-8 rounded-[1.6rem] border border-[#f4d5d8] bg-white/90 p-5 text-sm font-semibold leading-6 text-[#696875] shadow-[0_18px_48px_rgba(48,48,61,0.06)]">
            <strong className="text-[#30303d]">Disclosure:</strong> this guide is published by BooDoo. We link to each developer’s official information, avoid paid rankings and state where another product may be a better fit.
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="overflow-x-auto rounded-[2rem] border border-[#f4d5d8] bg-white shadow-[0_24px_70px_rgba(48,48,61,0.07)]">
          <table className="min-w-[900px] border-collapse text-left">
            <thead className="bg-[#fff1f2] text-sm uppercase tracking-[0.08em] text-[#746d76]">
              <tr>
                <th className="p-5 font-black">App</th>
                <th className="p-5 font-black">Best for</th>
                <th className="p-5 font-black">Platforms</th>
                <th className="p-5 font-black">Starting point</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.name} className="border-t border-[#f2e4e6] align-top">
                  <td className="p-5 text-lg font-black text-[#30303d]">{app.name}</td>
                  <td className="max-w-xs p-5 font-semibold leading-6 text-[#5f5d68]">{app.bestFor}</td>
                  <td className="p-5 font-semibold text-[#5f5d68]">{app.platforms}</td>
                  <td className="p-5 font-semibold text-[#5f5d68]">{app.free}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 space-y-6">
          {apps.map((app, index) => (
            <article
              key={app.name}
              className={`rounded-[2rem] border bg-white p-7 shadow-[0_24px_70px_rgba(48,48,61,0.07)] sm:p-9 ${
                index === 0 ? "border-2 border-[#ff5865]" : "border-[#f4d5d8]"
              }`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[#ff5865]">
                    {index + 1}. {app.bestFor}
                  </p>
                  <h2 className="mt-2 text-4xl font-black text-[#30303d]">{app.name}</h2>
                </div>
                {app.name === "BooDoo" ? (
                  <AppStoreLink
                    location="best_apps_boodoo_card"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ff5865] px-5 text-sm font-semibold text-white transition hover:bg-[#e24752]"
                  >
                    Download BooDoo
                    <ArrowRight size={16} aria-hidden="true" />
                  </AppStoreLink>
                ) : (
                  <a
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#f4d5d8] bg-[#f7f6f4] px-5 text-sm font-black text-[#5f5d68] transition hover:border-[#ffadb5] hover:text-[#ff5865]"
                  >
                    {app.sourceLabel}
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                )}
              </div>
              <ul className="mt-7 grid gap-3 text-sm font-bold text-[#5d5b66] md:grid-cols-3">
                {app.strengths.map((strength) => (
                  <li key={strength} className="flex gap-3 rounded-[1.2rem] bg-[#f7f6f4] p-4">
                    <Check className="mt-0.5 shrink-0 text-[#ff5865]" size={18} aria-hidden="true" />
                    {strength}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-semibold leading-6 text-[#74727e]">
                <strong className="text-[#30303d]">Consider:</strong> {app.consider}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#f1d7da] bg-white py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">How to choose</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">Test the difficult moment—not the feature list.</h2>
          <div className="mt-7 space-y-4 text-lg font-medium leading-8 text-[#74727e]">
            <p>
              Install two candidates and log the same bottle, nap and diaper change in each. Then check how quickly you can answer three questions: When was the last feed? How long has the baby been awake? What happened across the whole day?
            </p>
            <p>
              If you mainly want sleep predictions or coaching, prioritize a specialist. If you want a calm all-in-one record with visible educational sources, try BooDoo. Whichever app you choose, a tracker organizes information—it cannot diagnose a medical problem.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">FAQ</p>
        <h2 className="mt-3 text-4xl font-black sm:text-5xl">Common questions</h2>
        <div className="mt-8 space-y-3">
          {faq.map((item) => (
            <details key={item.question} className="rounded-[1.5rem] border border-[#f4d5d8] bg-white p-5">
              <summary className="cursor-pointer list-none text-lg font-black">{item.question}</summary>
              <p className="mt-3 max-w-3xl font-medium leading-7 text-[#74727e]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="grid gap-8 rounded-[2.2rem] bg-[#ff5865] p-8 text-white shadow-[0_32px_90px_rgba(255,88,101,0.28)] md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <h2 className="text-4xl font-black sm:text-5xl">Try the tracker built to explain the day.</h2>
            <p className="mt-4 max-w-2xl font-semibold leading-7 text-white/85">
              Start with BooDoo free on iPhone and iPad.
            </p>
          </div>
          <AppStoreLink
            location="best_apps_footer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#30303d] transition hover:text-[#ff5865]"
          >
            <Download size={18} aria-hidden="true" />
            Download BooDoo
          </AppStoreLink>
        </div>
      </section>

      <footer className="border-t border-[#ead8da] bg-white py-9">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm font-bold text-[#74727e] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link href="/" className="font-black text-[#30303d]">BooDoo</Link>
          <div className="flex flex-wrap gap-4">
            <Link href="/huckleberry-alternative" className="hover:text-[#ff5865]">Huckleberry alternative</Link>
            <Link href="/free-baby-tracker-app" className="hover:text-[#ff5865]">Free baby tracker</Link>
            <Link href="/medical-sources" className="hover:text-[#ff5865]">Medical sources</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

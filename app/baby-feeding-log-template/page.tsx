import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import AppStoreLink from "../../components/AppStoreLink";
import PrintableFeedingLog from "../../components/PrintableFeedingLog";

const title = "Free Printable Baby Feeding Log Template | BooDoo";
const description =
  "Use this free printable baby feeding log to record feeding times, amounts, durations, diapers and notes—or track everything in the BooDoo app.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/baby-feeding-log-template"
  },
  openGraph: {
    title,
    description,
    url: "https://www.boodoo.app/baby-feeding-log-template",
    type: "article",
    images: ["/screenshots/02-daily-report-milk.png"]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/screenshots/02-daily-report-milk.png"]
  }
};

const faq = [
  {
    question: "What should I record in a baby feeding log?",
    answer:
      "This template provides fields for time, feed type, amount or duration, wet and dirty diapers, and notes. Record any additional details specifically requested by your healthcare professional."
  },
  {
    question: "Can I type into this feeding log before printing?",
    answer:
      "Yes. The header fields, table cells and notes area can be completed in the browser before you press Print. You can also print a blank copy."
  },
  {
    question: "Does the template calculate how much my baby should drink?",
    answer:
      "No. Feeding needs are individual. This template records information and does not calculate a medical feeding target."
  },
  {
    question: "Can I use an app instead of paper?",
    answer:
      "Yes. BooDoo records feeding times and amounts alongside sleep, diapers, growth, goals and reports on iPhone and iPad."
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
        name: "Baby feeding log template",
        item: "https://www.boodoo.app/baby-feeding-log-template"
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
    mainEntityOfPage: "https://www.boodoo.app/baby-feeding-log-template"
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

export default function BabyFeedingLogTemplatePage() {
  return (
    <main className="min-h-screen bg-[#f7f6f4] text-[#30303d]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
        }}
      />

      <header className="border-b border-white/70 bg-[#f7f6f4]/90 backdrop-blur-2xl print:hidden">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="BooDoo home">
            <Image src="/icons/boodoo-icon.png" alt="" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-black">BooDoo</span>
          </Link>
          <AppStoreLink
            location="feeding_template_header"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ff5865] px-5 text-sm font-semibold text-white transition hover:bg-[#e24752]"
          >
            <Download size={17} aria-hidden="true" />
            Download
          </AppStoreLink>
        </nav>
      </header>

      <section className="bg-[radial-gradient(circle_at_20%_20%,rgba(255,88,101,0.18),transparent_30%),linear-gradient(180deg,#fff_0%,#f7f6f4_92%)] py-16 print:hidden sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="inline-flex rounded-full border border-[#ffd9dd] bg-white/85 px-4 py-2 text-sm font-extrabold text-[#ff5865] shadow-sm">
            Free printable baby feeding log
          </p>
          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            Record feeds clearly—on paper or in BooDoo.
          </h1>
          <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-[#696875] sm:text-xl">
            Use the editable template below to record feed times, amounts or durations, diapers and notes. Print a blank sheet, type first and print later, or move the whole routine into the BooDoo app.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 print:max-w-none print:p-0 sm:px-8 sm:py-20">
        <PrintableFeedingLog />
      </div>

      <section className="border-y border-[#f1d7da] bg-white py-20 print:hidden">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">Why log feeds?</p>
            <h2 className="mt-3 text-4xl font-black sm:text-5xl">A clear record is easier to share.</h2>
            <p className="mt-5 text-lg font-medium leading-8 text-[#74727e]">
              A simple timeline can help parents and caregivers coordinate and makes it easier to answer factual questions about when and how a baby was fed. It does not decide what or how much an individual baby should eat.
            </p>
          </div>
          <div className="rounded-[2rem] border border-[#f4d5d8] bg-[#f7f6f4] p-7">
            <h2 className="text-2xl font-black">When paper becomes difficult</h2>
            <p className="mt-4 font-medium leading-7 text-[#74727e]">
              BooDoo stores feeding entries with sleep, diapers and growth, calculates useful intervals and turns the day into a clearer dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <AppStoreLink
                location="feeding_template_midpage"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ff5865] px-5 text-sm font-black text-white transition hover:bg-[#e24752]"
              >
                Try BooDoo free
                <ArrowRight size={16} aria-hidden="true" />
              </AppStoreLink>
              <Link
                href="/baby-feeding-tracker"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#f4d5d8] bg-white px-5 text-sm font-black text-[#5f5d68] transition hover:border-[#ffadb5] hover:text-[#ff5865]"
              >
                Explore the feeding tracker
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 print:hidden sm:px-8">
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

      <footer className="border-t border-[#ead8da] bg-white py-9 print:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm font-bold text-[#74727e] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link href="/" className="font-black text-[#30303d]">BooDoo</Link>
          <div className="flex flex-wrap gap-4">
            <Link href="/free-baby-tracker-app" className="hover:text-[#ff5865]">Free baby tracker</Link>
            <Link href="/medical-sources" className="hover:text-[#ff5865]">Medical sources</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

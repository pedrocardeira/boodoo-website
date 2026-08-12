import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Download, ExternalLink } from "lucide-react";
import { allTrafficPages, type TrafficPageContent } from "../lib/traffic-pages";
import AppStoreLink from "./AppStoreLink";

const coreTools = [
  { href: "/baby-feeding-tracker", label: "Baby feeding tracker" },
  { href: "/baby-sleep-tracker", label: "Baby sleep tracker" },
  { href: "/baby-growth-tracker", label: "Baby growth tracker" },
  { href: "/newborn-tracker", label: "All-in-one newborn tracker" }
];

function structuredData(page: TrafficPageContent) {
  return [
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
          name: page.eyebrow,
          item: `https://www.boodoo.app/${page.slug}`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.metadataTitle,
      description: page.description,
      image: "https://www.boodoo.app/screenshots/01-dashboard-photo-sources.png",
      mainEntityOfPage: `https://www.boodoo.app/${page.slug}`,
      author: {
        "@type": "Person",
        name: "José Cardeira",
        url: "https://www.boodoo.app/about"
      },
      publisher: {
        "@type": "Organization",
        name: "BooDoo",
        url: "https://www.boodoo.app/"
      }
    }
  ];
}

export default function TrafficLandingPage({ page }: { page: TrafficPageContent }) {
  const relatedTrafficPages = allTrafficPages.filter((item) => item.slug !== page.slug);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f6f4] text-[#30303d]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(page)).replace(/</g, "\\u003c")
        }}
      />

      <header className="border-b border-white/70 bg-[#f7f6f4]/90 backdrop-blur-2xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="BooDoo home">
            <Image
              src="/icons/boodoo-icon.png"
              alt=""
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span className="text-xl font-black text-[#30303d]">BooDoo</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-bold text-[#696875] md:flex">
            <Link href="/baby-feeding-tracker" className="transition hover:text-[#ff5865]">
              Feeding
            </Link>
            <Link href="/baby-sleep-tracker" className="transition hover:text-[#ff5865]">
              Sleep
            </Link>
            <Link href="/medical-sources" className="transition hover:text-[#ff5865]">
              Medical sources
            </Link>
          </div>
          <AppStoreLink
            location={`${page.slug}_header`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ff5865] px-5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(255,88,101,0.28)] transition hover:bg-[#e24752] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5865]"
          >
            <Download size={17} aria-hidden="true" />
            Download
          </AppStoreLink>
        </nav>
      </header>

      <section className="relative pt-16 sm:pt-20">
        <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_20%_20%,rgba(255,88,101,0.18),transparent_28%),linear-gradient(180deg,#fff_0%,#f7f6f4_88%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:pb-24">
          <div className="max-w-3xl">
            <p className="mb-7 inline-flex items-center rounded-full border border-[#ffd9dd] bg-white/80 px-4 py-2 text-sm font-extrabold text-[#ff5865] shadow-sm">
              {page.eyebrow}
            </p>
            <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.035em] text-[#2f2f3d] sm:text-6xl lg:text-7xl">
              {page.title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-[#696875] sm:text-xl">
              {page.intro}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <AppStoreLink
                location={`${page.slug}_hero`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ff5865] px-7 text-sm font-semibold text-white shadow-[0_22px_54px_rgba(255,88,101,0.28)] transition hover:bg-[#e24752] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5865]"
              >
                <Download size={18} aria-hidden="true" />
                Download free on the App Store
              </AppStoreLink>
              <Link
                href="#details"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#f7cfd3] bg-white px-7 text-sm font-semibold text-[#30303d] shadow-[0_18px_45px_rgba(48,48,61,0.08)] transition hover:border-[#ffadb5] hover:text-[#ff5865]"
              >
                Read the details
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex w-full justify-center">
            <div className="absolute inset-y-14 left-1/2 w-[30rem] -translate-x-1/2 rounded-full bg-[#ff5865]/12 blur-3xl" />
            <div className="phone-frame relative">
              <Image
                src="/screenshots/01-dashboard-photo-sources.png"
                alt="BooDoo baby tracker dashboard on iPhone"
                width={1242}
                height={2688}
                priority
                className="h-full w-full rounded-[2.15rem] object-cover"
                sizes="(max-width: 768px) 72vw, 350px"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#f1d7da] bg-white/70 py-7">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:px-8 md:grid-cols-3">
          {page.highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.6rem] bg-white/85 p-5 shadow-[0_18px_48px_rgba(48,48,61,0.07)]"
            >
              <h2 className="text-xl font-black text-[#ff5865]">{item.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#74727e]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="details" className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">
          A practical guide
        </p>
        <div className="mt-8 space-y-6">
          {page.sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-[2rem] border border-[#f4d5d8] bg-white p-7 shadow-[0_24px_70px_rgba(48,48,61,0.07)] sm:p-9"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe3e6] text-sm font-black text-[#ff5865]">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-3xl font-black text-[#30303d] sm:text-4xl">
                    {section.title}
                  </h2>
                  <div className="mt-5 space-y-4 text-base font-medium leading-8 text-[#74727e] sm:text-lg">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets ? (
                    <ul className="mt-6 grid gap-3 text-sm font-bold text-[#5d5b66] sm:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <Check
                            className="mt-0.5 shrink-0 text-[#ff5865]"
                            size={18}
                            aria-hidden="true"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {page.externalSources?.length ? (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <h2 className="text-2xl font-black text-[#30303d]">Sources and further reading</h2>
            <p className="mt-3 max-w-3xl font-medium leading-7 text-[#74727e]">
              Review the current information from the official sources linked below. Guidance and product features can change over time.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {page.externalSources.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-[#f4d5d8] bg-[#f7f6f4] p-5 text-sm font-black text-[#5d5b66] transition hover:border-[#ffadb5] hover:text-[#ff5865]"
                >
                  {source.label}
                  <ExternalLink size={17} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">FAQ</p>
        <h2 className="mt-3 text-4xl font-black text-[#30303d] sm:text-5xl">
          Common questions
        </h2>
        <div className="mt-8 space-y-3">
          {page.faq.map((item) => (
            <details
              key={item.question}
              className="group rounded-[1.5rem] border border-[#f4d5d8] bg-white p-5 shadow-[0_18px_48px_rgba(48,48,61,0.05)]"
            >
              <summary className="cursor-pointer list-none pr-6 text-lg font-black text-[#30303d]">
                {item.question}
              </summary>
              <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-[#74727e]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-y border-[#f1d7da] bg-white/70 py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">
            Explore BooDoo
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#30303d] sm:text-4xl">
            Track the parts of the day that matter
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreTools.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[1.6rem] border border-[#f4d5d8] bg-white p-5 shadow-[0_18px_48px_rgba(48,48,61,0.06)] transition hover:-translate-y-1 hover:border-[#ffadb5]"
              >
                <h3 className="text-lg font-black text-[#30303d] group-hover:text-[#ff5865]">
                  {item.label}
                </h3>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#ff5865]">
                  Learn more
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedTrafficPages.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="rounded-full border border-[#f4d5d8] bg-white px-4 py-2 text-sm font-black text-[#696875] hover:border-[#ffadb5] hover:text-[#ff5865]"
              >
                {item.eyebrow}
              </Link>
            ))}
            <Link
              href="/best-baby-tracker-apps"
              className="rounded-full border border-[#f4d5d8] bg-white px-4 py-2 text-sm font-black text-[#696875] hover:border-[#ffadb5] hover:text-[#ff5865]"
            >
              Best baby tracker apps
            </Link>
            <Link
              href="/baby-feeding-log-template"
              className="rounded-full border border-[#f4d5d8] bg-white px-4 py-2 text-sm font-black text-[#696875] hover:border-[#ffadb5] hover:text-[#ff5865]"
            >
              Printable feeding log
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 rounded-[2.2rem] bg-[#ff5865] p-8 text-white shadow-[0_32px_90px_rgba(255,88,101,0.28)] md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <h2 className="text-4xl font-black sm:text-5xl">Log simply. Understand better.</h2>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/85">
              Track feeding, sleep, diapers and growth on iPhone and iPad.
            </p>
          </div>
          <AppStoreLink
            location={`${page.slug}_footer`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#30303d] shadow-[0_18px_45px_rgba(48,48,61,0.08)] transition hover:text-[#ff5865]"
          >
            <Download size={18} aria-hidden="true" />
            Download on the App Store
          </AppStoreLink>
        </div>
      </section>

      <footer className="border-t border-[#ead8da] bg-white py-9">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm font-bold text-[#74727e] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link href="/" className="flex items-center gap-3 text-[#30303d]">
            <Image
              src="/icons/boodoo-icon.png"
              alt=""
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-black">BooDoo</span>
          </Link>
          <p>
            BooDoo provides educational information and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </main>
  );
}

import type { Metadata } from "next";
import { BarChart3, BookOpen, Heart, Timer, UserRoundCheck } from "lucide-react";
import TrustPageLayout, { TextLink } from "../../components/TrustPageLayout";

const title = "About BooDoo | Built by a Father for Clearer Baby Tracking";
const description =
  "Discover why José Cardeira created BooDoo after Eva was born: to track feeding, sleep, poop and growth and understand what the daily data means.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title,
    description,
    url: "https://www.boodoo.app/about",
    siteName: "BooDoo",
    images: [
      {
        url: "/screenshots/01-dashboard-photo-sources.png",
        width: 1242,
        height: 2688,
        alt: "BooDoo baby tracker dashboard"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/screenshots/01-dashboard-photo-sources.png"]
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About BooDoo",
  url: "https://www.boodoo.app/about",
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "BooDoo",
    applicationCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS",
    creator: {
      "@type": "Person",
      name: "José Cardeira"
    },
    url: "https://www.boodoo.app/"
  }
};

export default function AboutPage() {
  return (
    <TrustPageLayout
      eyebrow="About BooDoo"
      title="Built for Eva. Made for parents who want clarity."
      intro="BooDoo began when Eva was born and her father, José Cardeira, wanted a reliable way to know whether she was feeding, sleeping and growing well—without trying to reconstruct the day from memory."
      image="/screenshots/01-dashboard-photo-sources.png"
      imageAlt="BooDoo dashboard created to track Eva's feeding, sleep, poop and growth"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
        }}
      />

      <section className="border-y border-[#f1d7da] bg-white/70 py-8">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <blockquote className="text-2xl font-black leading-9 text-[#30303d] sm:text-3xl sm:leading-10">
            “I did not only want to record what happened. I wanted to understand whether Eva was growing well.”
          </blockquote>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.12em] text-[#ff5865]">
            José Cardeira · Creator of BooDoo
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">The story</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
            Fatherhood created the need.
          </h2>
        </div>
        <div className="space-y-5 text-lg font-medium leading-8 text-[#74727e]">
          <p>
            I am José Cardeira, a father and software and data professional. When Eva was born, I found myself asking the same questions many parents ask: How much milk has she had today? How long has she slept? When was the last feed? Is her weight moving in the right direction?
          </p>
          <p>
            Individual notes could record an amount or a time, but they did not give me the confidence I needed. I wanted one clear view of feeds, sleep, poop, weight and height—and I wanted to understand what those numbers meant for a baby of Eva's age.
          </p>
          <p>
            That is why I built BooDoo. It started as a practical tool for my own family and became a baby tracker for parents and caregivers who want the same clarity.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">What makes it different</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
            A tracker that explains the data.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Timer,
                title: "Log simply",
                text: "Record feeds, sleep and poop from one dashboard in seconds."
              },
              {
                icon: BarChart3,
                title: "Understand the day",
                text: "See totals, intervals, goals and reports instead of disconnected timestamps."
              },
              {
                icon: BookOpen,
                title: "Check the source",
                text: "Open the reference behind educational guidance instead of accepting an unexplained recommendation."
              }
            ].map(({ icon: Icon, title: cardTitle, text }) => (
              <article
                key={cardTitle}
                className="rounded-[1.75rem] border border-[#f4d5d8] bg-[#f7f6f4] p-7 shadow-[0_22px_60px_rgba(48,48,61,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe3e6] text-[#ff5865]">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-2xl font-black text-[#30303d]">{cardTitle}</h3>
                <p className="mt-3 text-base font-medium leading-7 text-[#74727e]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[2rem] border border-[#f4d5d8] bg-white p-8 shadow-[0_24px_70px_rgba(48,48,61,0.07)]">
            <Heart className="text-[#ff5865]" size={30} aria-hidden="true" />
            <h2 className="mt-5 text-3xl font-black text-[#30303d]">Built around real family life</h2>
            <p className="mt-4 text-base font-medium leading-8 text-[#74727e]">
              BooDoo is designed for the moments when parents are tired, holding a baby and need the important information immediately. The interface keeps daily actions and answers close together.
            </p>
          </article>
          <article className="rounded-[2rem] border border-[#f4d5d8] bg-white p-8 shadow-[0_24px_70px_rgba(48,48,61,0.07)]">
            <UserRoundCheck className="text-[#ff5865]" size={30} aria-hidden="true" />
            <h2 className="mt-5 text-3xl font-black text-[#30303d]">Honest about its role</h2>
            <p className="mt-4 text-base font-medium leading-8 text-[#74727e]">
              BooDoo helps families organize and understand records. It does not diagnose a baby or replace a pediatrician. Educational recommendations show their sources so parents can read the original guidance.
            </p>
            <p className="mt-5">
              <TextLink href="/medical-sources">Read how sources are used</TextLink>
            </p>
          </article>
        </div>
      </section>
    </TrustPageLayout>
  );
}

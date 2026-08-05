import type { Metadata } from "next";
import { AlertTriangle, BookOpenCheck, ExternalLink, FileSearch, ShieldCheck } from "lucide-react";
import TrustPageLayout from "../../components/TrustPageLayout";

const title = "Medical Sources & Disclaimer | BooDoo Baby Tracker";
const description =
  "See how BooDoo uses source-linked educational guidance from organizations including the AAP, HealthyChildren.org, WHO and AASM—and understand its medical limitations.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/medical-sources" },
  openGraph: {
    title,
    description,
    url: "https://www.boodoo.app/medical-sources",
    siteName: "BooDoo",
    images: [
      {
        url: "/screenshots/05-daily-goal-sources.png",
        width: 1242,
        height: 2688,
        alt: "BooDoo daily goals showing visible medical reference sources"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/screenshots/05-daily-goal-sources.png"]
  }
};

const sources = [
  {
    name: "American Academy of Pediatrics (AAP)",
    area: "Pediatric guidance and parent education",
    text: "BooDoo refers to pediatric information published by the AAP and its parent-facing HealthyChildren.org website, including material about infant feeding and stool patterns.",
    links: [
      {
        label: "HealthyChildren.org: How often and how much should your baby eat?",
        href: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/how-often-and-how-much-should-your-baby-eat.aspx"
      },
      {
        label: "HealthyChildren.org: The many colors of baby poop",
        href: "https://www.healthychildren.org/English/ages-stages/baby/Pages/The-Many-Colors-of-Poop.aspx"
      }
    ]
  },
  {
    name: "World Health Organization (WHO)",
    area: "Child growth standards",
    text: "WHO Child Growth Standards provide recognized reference material for measurements such as weight-for-age, length or height-for-age and weight-for-length.",
    links: [
      {
        label: "WHO Child Growth Standards",
        href: "https://www.who.int/tools/child-growth-standards/standards"
      },
      {
        label: "WHO length and height for age",
        href: "https://www.who.int/tools/child-growth-standards/standards/length-height-for-age"
      }
    ]
  },
  {
    name: "American Academy of Sleep Medicine (AASM)",
    area: "Infant and child sleep duration",
    text: "BooDoo uses recognized sleep-duration guidance to provide educational context for sleep totals. Individual sleep needs and safe-sleep decisions still require professional guidance.",
    links: [
      {
        label: "AASM consensus recommendations for pediatric sleep duration",
        href: "https://jcsm.aasm.org/doi/10.5664/jcsm.5866"
      }
    ]
  },
  {
    name: "Stanford Medicine Children's Health",
    area: "Supporting pediatric reference material",
    text: "BooDoo may also link to established pediatric educational material from Stanford Medicine Children's Health when it supports the context shown in the app.",
    links: [
      {
        label: "Stanford Medicine Children's Health",
        href: "https://www.stanfordchildrens.org/"
      }
    ]
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "BooDoo Medical Sources and Disclaimer",
  url: "https://www.boodoo.app/medical-sources",
  description,
  about: {
    "@type": "SoftwareApplication",
    name: "BooDoo",
    applicationCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS"
  }
};

export default function MedicalSourcesPage() {
  return (
    <TrustPageLayout
      eyebrow="Medical sources"
      title="See the sources behind BooDoo's guidance."
      intro="BooDoo connects educational recommendations to recognized pediatric and public-health sources. References remain visible so parents can check where information comes from and read the original material."
      image="/screenshots/05-daily-goal-sources.png"
      imageAlt="BooDoo daily goals screen displaying medical reference sources"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
        }}
      />

      <section className="border-y border-[#f1d7da] bg-white/70 py-8">
        <div className="mx-auto flex max-w-5xl items-start gap-4 px-5 sm:px-8">
          <ShieldCheck className="mt-1 shrink-0 text-[#ff5865]" size={30} aria-hidden="true" />
          <div>
            <h2 className="text-2xl font-black text-[#30303d]">Educational guidance, not a diagnosis</h2>
            <p className="mt-3 text-base font-semibold leading-7 text-[#74727e]">
              BooDoo provides educational information and is not a substitute for professional medical advice, diagnosis or treatment.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">How sources are used</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
          The reference stays connected to the recommendation.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: FileSearch,
              title: "Recognized organizations",
              text: "Guidance is based on published material from established pediatric, sleep and public-health organizations."
            },
            {
              icon: BookOpenCheck,
              title: "Visible source links",
              text: "Where BooDoo presents educational guidance, it aims to show the organization or direct source so you can verify it."
            },
            {
              icon: ShieldCheck,
              title: "Age-relevant context",
              text: "BooDoo uses your baby's age to display relevant educational context, while leaving individual decisions to families and clinicians."
            }
          ].map(({ icon: Icon, title: cardTitle, text }) => (
            <article
              key={cardTitle}
              className="rounded-[1.75rem] border border-[#f4d5d8] bg-white p-7 shadow-[0_22px_60px_rgba(48,48,61,0.07)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe3e6] text-[#ff5865]">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-2xl font-black text-[#30303d]">{cardTitle}</h3>
              <p className="mt-3 text-base font-medium leading-7 text-[#74727e]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">Reference library</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
            Organizations referenced by BooDoo
          </h2>
          <div className="mt-10 space-y-5">
            {sources.map((source) => (
              <article
                key={source.name}
                className="rounded-[2rem] border border-[#f4d5d8] bg-[#f7f6f4] p-7 shadow-[0_24px_70px_rgba(48,48,61,0.05)] sm:p-9"
              >
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ff5865]">{source.area}</p>
                <h3 className="mt-2 text-3xl font-black text-[#30303d]">{source.name}</h3>
                <p className="mt-4 text-base font-medium leading-8 text-[#74727e]">{source.text}</p>
                <div className="mt-5 space-y-2">
                  {source.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 font-black leading-6 text-[#ff5865] hover:text-[#e24752]"
                    >
                      <ExternalLink className="mt-1 shrink-0" size={16} aria-hidden="true" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-5 py-20 sm:px-8 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-[#f4d5d8] bg-white p-8 shadow-[0_24px_70px_rgba(48,48,61,0.07)]">
          <AlertTriangle className="text-[#ff5865]" size={30} aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-black text-[#30303d]">What BooDoo does not do</h2>
          <ul className="mt-5 space-y-3 text-base font-medium leading-7 text-[#74727e]">
            <li>• It does not diagnose illness, feeding problems, sleep disorders or growth conditions.</li>
            <li>• It does not monitor vital signs or verify that a baby is healthy.</li>
            <li>• It does not replace individual advice from a pediatrician or other qualified professional.</li>
            <li>• It does not guarantee that a suggested target is appropriate for every baby.</li>
          </ul>
        </article>

        <article className="rounded-[2rem] bg-[#30303d] p-8 text-white shadow-[0_24px_70px_rgba(48,48,61,0.18)]">
          <h2 className="text-3xl font-black">Medical disclaimer</h2>
          <p className="mt-5 text-base font-semibold leading-8 text-white/80">
            Information provided by BooDoo is for general educational and tracking purposes only. It is not medical advice and should not be used to diagnose, treat, cure or prevent any condition.
          </p>
          <p className="mt-4 text-base font-semibold leading-8 text-white/80">
            Always consult a qualified healthcare professional about your baby's feeding, sleep, stool, growth, development or health. If you believe your baby may need urgent help, contact local emergency services immediately.
          </p>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.12em] text-[#ffadb5]">
            Last updated: August 2026
          </p>
        </article>
      </section>
    </TrustPageLayout>
  );
}

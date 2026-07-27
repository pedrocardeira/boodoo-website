import Image from "next/image";
import {
  Baby,
  Bell,
  Check,
  Download,
  Droplets,
  Moon,
  Scale,
  ShieldCheck,
  Stethoscope,
  Target,
  Users
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { QuestionForm } from "@/components/question-form";

const appStoreUrl = "https://apps.apple.com/us/app/boodoo/id6784456363";

const features = [
  {
    icon: Droplets,
    title: "Smart feeding recommendations",
    copy: "BooDoo compares intake with trusted guidance and helps you understand when feeding goals should change."
  },
  {
    icon: Moon,
    title: "Evidence-based sleep guidance",
    copy: "Understand awake windows, sleep totals and recommended timings based on trusted pediatric organizations."
  },
  {
    icon: Baby,
    title: "Diaper insights",
    copy: "Record diaper color and patterns with clear explanations and medical references when they matter."
  },
  {
    icon: Target,
    title: "Adaptive feeding and sleeping goals",
    copy: "Feeding and sleep goals adjust as your baby grows, so daily targets stay useful over time."
  },
  {
    icon: Scale,
    title: "Growth tracking",
    copy: "Monitor weight, height and development alongside the daily details that explain the bigger picture."
  },
  {
    icon: Bell,
    title: "Reminders",
    copy: "Never miss feed and sleep alerts when the day gets busy."
  }
];

const screenshots = [
  {
    src: "/screenshots/01-dashboard-photo-sources.png",
    title: "Everything on one screen.",
    caption: "Feeds. Sleep. Diapers. Growth. Medical guidance. Everything parents need at a glance."
  },
  {
    src: "/screenshots/02-daily-report-milk.png",
    title: "Daily Summary",
    caption: "Beautiful summaries you can review yourself or share with your partner or pediatrician."
  },
  {
    src: "/screenshots/03-interval-and-awake-window.png",
    title: "Always know what is next.",
    caption: "See the last feed, next recommended feed and remaining time automatically."
  },
  {
    src: "/screenshots/04-dashboard-poo-feedback.png",
    title: "Clear feedback",
    caption: "Understand what needs attention without turning the home screen into noise."
  },
  {
    src: "/screenshots/05-daily-goal-sources.png",
    title: "Adaptive goals",
    caption: "Recommended daily goals, averages and trusted sources stay together."
  },
  {
    src: "/screenshots/06-settings-subscription.png",
    title: "Settings",
    caption: "Feature switches, plan status and privacy controls stay simple."
  },
  {
    src: "/screenshots/07-dashboard-poo-selected.png",
    title: "Diaper patterns",
    caption: "Record colors quickly and understand patterns over time."
  },
  {
    src: "/screenshots/08-dashboard-clean.png",
    title: "Calm dashboard",
    caption: "A quiet daily view for exhausted parents."
  }
];

const references = [
  "American Academy of Pediatrics (AAP)",
  "HealthyChildren.org",
  "World Health Organization (WHO)",
  "Stanford Medicine Children's Health",
  "American Academy of Sleep Medicine (AASM)"
];

const proFeatures = [
  "Full history, not limited to today",
  "Full reports to understand patterns",
  "Scores and averages for feeds, sleep and poop",
  "Feed and sleep alerts",
  "Custom feeding intervals",
  "Custom colors and theme",
  "Track growth with weight and height",
  "Ready for future Pro features"
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Private by design",
    copy: "Your baby's information stays private and securely stored from day one."
  },
  {
    icon: Stethoscope,
    title: "Trusted medical guidance",
    copy: "Every recommendation includes its medical source, so you always know where guidance comes from."
  },
  {
    icon: Users,
    title: "Built for families",
    copy: "Designed for parents, grandparents and caregivers."
  }
];

function PhoneFrame({ src, title, priority = false }: { src: string; title: string; priority?: boolean }) {
  return (
    <div className="phone-frame">
      <Image
        src={src}
        alt={`BooDoo app screenshot: ${title}`}
        width={1242}
        height={2688}
        priority={priority}
        className="h-full w-full rounded-[2.15rem] object-cover"
        sizes="(max-width: 768px) 72vw, 350px"
      />
    </div>
  );
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BooDoo",
    applicationCategory: "HealthApplication",
    operatingSystem: "iOS, iPadOS",
    description:
      "An evidence-based baby tracker optimized for iPhone and iPad with feeds, sleep, diapers, growth, reports, and trusted medical guidance.",
    offers: [
      { "@type": "Offer", name: "BooDoo Free", price: "0", priceCurrency: "USD" },
      { "@type": "Offer", name: "BooDoo Pro", priceCurrency: "USD" }
    ]
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f6f4] text-[#30303d]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/70 bg-[#f7f6f4]/82 backdrop-blur-2xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="BooDoo home">
            <Image src="/icons/boodoo-icon.png" alt="" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-black tracking-normal text-[#30303d]">BooDoo</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-bold text-[#696875] md:flex">
            <a href="#features" className="transition hover:text-[#ff5865]">Features</a>
            <a href="#screenshots" className="transition hover:text-[#ff5865]">Screens</a>
            <a href="#references" className="transition hover:text-[#ff5865]">Guidance</a>
            <a href="#pricing" className="transition hover:text-[#ff5865]">Pricing</a>
          </div>
          <ButtonLink href={appStoreUrl} className="bg-[#ff5865] shadow-[0_18px_42px_rgba(255,88,101,0.26)] hover:bg-[#e24752]">
            <Download size={17} aria-hidden />
            Download
          </ButtonLink>
        </nav>
      </header>

      <section className="relative pt-28 sm:pt-32">
        <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_20%_20%,rgba(255,88,101,0.18),transparent_28%),linear-gradient(180deg,#fff_0%,#f7f6f4_88%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:pb-24">
          <Reveal className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#ffd9dd] bg-white/78 px-4 py-2 text-sm font-extrabold text-[#ff5865] shadow-sm">
              <Image src="/icons/boodoo-icon.png" alt="" width={26} height={26} className="rounded-lg" />
              BooDoo Pro for iPhone and iPad
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-[#2f2f3d] sm:text-6xl lg:text-7xl">
              The baby tracker that explains what the data means.
            </h1>
            <p className="mt-7 max-w-xl text-lg font-medium leading-8 text-[#696875] sm:text-xl">
              Set goals and track feeds, sleep, diapers, growth and milestones in seconds. BooDoo is optimized for iPhone and iPad, with trusted medical guidance built into every recommendation and adapted to your baby's age.
            </p>
            <div id="download" className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={appStoreUrl} className="bg-[#ff5865] px-7 shadow-[0_22px_54px_rgba(255,88,101,0.28)] hover:bg-[#e24752]">
                <Download size={18} aria-hidden />
                Download on the App Store
              </ButtonLink>
              <ButtonLink href="#screenshots" variant="secondary" className="border-[#f7cfd3] bg-white text-[#30303d]">
                See how it works
              </ButtonLink>
            </div>
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {[
                ["1 Tap", "Everything Logged"],
                ["Trusted Medical Guidance", "Built In"],
                ["Notifications", "Never miss feed and sleep times"]
              ].map(([value, label]) => (
                <div key={value} className="rounded-[1.6rem] bg-white/74 p-4 shadow-[0_18px_48px_rgba(48,48,61,0.07)]">
                  <dt className="text-lg font-black leading-tight text-[#ff5865] sm:text-xl">{value}</dt>
                  <dd className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-[#8e8d98]">{label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.08} className="relative mx-auto flex w-full justify-center">
            <div className="absolute inset-y-14 left-1/2 w-[34rem] -translate-x-1/2 rounded-full bg-[#ff5865]/12 blur-3xl" />
            <div className="relative flex w-full max-w-[30rem] justify-center">
              <PhoneFrame src="/screenshots/01-dashboard-photo-sources.png" title="dashboard with sources" priority />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-[#f1d7da] bg-white/70 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 text-sm font-black uppercase tracking-[0.14em] text-[#8b8994] sm:px-8">
          <span>Log feed, sleep or diaper in 1 tap</span>
          <span className="text-[#ff5865]">Medical references included</span>
          <span>Unlimited daily tracking</span>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <Reveal>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">Why BooDoo?</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
            Most baby trackers collect data.
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="rounded-[2rem] border border-[#f4d5d8] bg-white p-7 shadow-[0_24px_70px_rgba(48,48,61,0.07)]">
            <h3 className="text-3xl font-black text-[#30303d]">BooDoo explains it.</h3>
            <p className="mt-4 text-lg font-medium leading-8 text-[#74727e]">
              Instead of simply recording feeds, sleep and diapers, BooDoo compares them with trusted pediatric guidance so parents understand what the numbers actually mean.
            </p>
          </div>
        </Reveal>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
        <Reveal>
          <div className="grid gap-8 rounded-[2.2rem] bg-[#ff5865] p-8 text-white shadow-[0_32px_90px_rgba(255,88,101,0.28)] md:grid-cols-[1fr_auto] md:items-center md:p-12">
            <div>
              <h2 className="text-4xl font-black tracking-normal sm:text-5xl">Stop guessing. Start understanding.</h2>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/82">
                Track feeds, sleep, diapers and growth on iPhone and iPad with trusted medical guidance built into every day.
              </p>
            </div>
            <ButtonLink href={appStoreUrl} variant="secondary" className="bg-white px-7 text-[#30303d]">
              <Download size={18} aria-hidden />
              Download on the App Store
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">Features</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
            Understand the numbers.
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-[#74727e]">
            BooDoo compares feeds, sleep and daily goals with trusted medical guidance, helping parents understand what today's numbers mean.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, copy }, index) => (
            <Reveal key={title} delay={index * 0.03}>
              <article className="h-full rounded-[1.75rem] border border-[#f4d5d8] bg-white p-6 shadow-[0_22px_60px_rgba(48,48,61,0.07)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe3e6] text-[#ff5865]">
                  <Icon size={24} aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-black text-[#30303d]">{title}</h3>
                <p className="mt-2 text-base font-medium leading-7 text-[#74727e]">{copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="screenshots" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="mt-3 text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
                Everything on one screen.
              </h2>
            </div>
            <p className="max-w-sm text-sm font-bold leading-6 text-[#7a7884]">
              Feeds. Sleep. Diapers. Growth. Medical guidance. Everything parents need is visible at a glance.
            </p>
          </Reveal>
        </div>
        <div className="scrollbar-none mt-12 flex gap-6 overflow-x-auto px-5 pb-8 sm:px-8">
          {screenshots.slice(0, -1).map((shot) => (
            <article key={shot.src} className="w-[18.5rem] shrink-0">
              <PhoneFrame src={shot.src} title={shot.title} />
              <h3 className="mt-5 text-lg font-black text-[#30303d]">{shot.title}</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#74727e]">{shot.caption}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="references" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">Medical References</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
            Trusted medical guidance built into every recommendation and adapted to your baby's age.
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-[#74727e]">
            Every recommendation includes its medical source, so you always know where guidance comes from.
            Medical references are visible throughout the app instead of hidden behind links.
          </p>
          <p className="mt-6 rounded-[1.5rem] border border-[#f4d5d8] bg-white p-5 text-sm font-bold leading-6 text-[#6f6d78]">
            BooDoo provides educational information and is not a substitute for professional medical advice, diagnosis or treatment.
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="rounded-[2rem] bg-white p-5 shadow-[0_28px_80px_rgba(48,48,61,0.08)]">
            <Image
              src="/screenshots/03-interval-and-awake-window.png"
              alt="BooDoo interval and awake window screen showing medical reference sources"
              width={1242}
              height={2688}
              className="mx-auto max-h-[44rem] w-auto rounded-[1.75rem]"
              sizes="(max-width: 1024px) 90vw, 520px"
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-[#30303d] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff9ba4]">Growth and Reports</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
              Understand progress over time.
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 text-white/72">
              Daily and monthly summaries help you recognize trends, prepare for pediatric visits and keep everyone caring for your baby informed.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Daily milk totals", "Sleep duration", "Diaper history", "Growth trends"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/8 p-4 text-sm font-bold">
                  <Check size={18} className="text-[#ff7b85]" aria-hidden />
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <PhoneFrame src="/screenshots/02-daily-report-milk.png" title="daily report milk" />
          </Reveal>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">Pricing</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
            Start free. Upgrade when you need more.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Reveal>
            <article className="rounded-[2rem] border border-[#f4d5d8] bg-white p-7 shadow-[0_24px_70px_rgba(48,48,61,0.07)]">
              <h3 className="text-2xl font-black text-[#30303d]">Free</h3>
              <p className="mt-2 text-base font-semibold text-[#74727e]">Everything you need for everyday tracking.</p>
              <ul className="mt-7 space-y-4 text-sm font-bold text-[#5d5b66]">
                {["1-day history", "Daily summaries", "Medical references included"].map((item) => (
                  <li key={item} className="flex gap-3"><Check className="mt-0.5 text-[#ff5865]" size={18} aria-hidden />{item}</li>
                ))}
              </ul>
            </article>
          </Reveal>
          <Reveal delay={0.04}>
            <article className="h-full rounded-[2rem] border border-[#f4d5d8] bg-white p-7 shadow-[0_24px_70px_rgba(48,48,61,0.09)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[#ff5865]">Pro Monthly</p>
                  <h3 className="mt-3 text-2xl font-black text-[#30303d]">Billed monthly</h3>
                  <p className="mt-1 text-sm font-semibold text-[#74727e]">For trying Pro month by month.</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-[#30303d]">€1,99</p>
                  <p className="text-sm font-bold text-[#8e8d98]">/ month</p>
                </div>
              </div>
              <ul className="mt-8 space-y-4 text-sm font-bold text-[#5d5b66]">
                {proFeatures.map((item) => (
                  <li key={item} className="flex gap-3"><Check className="mt-0.5 text-[#ff5865]" size={18} aria-hidden />{item}</li>
                ))}
              </ul>
            </article>
          </Reveal>
          <Reveal delay={0.08}>
            <article className="relative h-full overflow-hidden rounded-[2rem] border-2 border-[#ff5865] bg-white p-7 shadow-[0_30px_84px_rgba(255,88,101,0.18)]">
              <div className="absolute right-5 top-5 rounded-full bg-[#ffe3e6] px-4 py-2 text-sm font-black text-[#ff5865]">
                Best value
              </div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#ff5865]">Pro Yearly</p>
              <h3 className="mt-3 text-2xl font-black text-[#30303d]">Billed yearly</h3>
              <div className="mt-5 flex items-end gap-3">
                <p className="text-5xl font-black text-[#30303d]">€17,99</p>
                <p className="pb-2 text-sm font-bold text-[#8e8d98]">/ year</p>
              </div>
              <p className="mt-3 text-base font-black text-[#ff5865]">
                Save €5,89 per year compared with monthly.
              </p>
              <p className="mt-1 text-sm font-semibold text-[#74727e]">
                About €1,50/month. 7 days free if eligible.
              </p>
              <ul className="mt-8 space-y-4 text-sm font-bold text-[#5d5b66]">
                {["Best price for Pro", ...proFeatures].map((item) => (
                  <li key={item} className="flex gap-3"><Check className="mt-0.5 text-[#ff5865]" size={18} aria-hidden />{item}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">Trust</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
              Built using guidance from
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {trustItems.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-[1.75rem] bg-[#f7f6f4] p-6">
                <Icon className="text-[#ff5865]" size={28} aria-hidden />
                <h3 className="mt-4 text-xl font-black text-[#30303d]">{title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#74727e]">{copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {references.map((source) => (
              <span key={source} className="rounded-full bg-[#ffe3e6] px-5 py-3 text-sm font-black text-[#ff5865]">
                {source}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">FAQ</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
            Have a question for BooDoo?
          </h2>
          <p className="mt-4 text-base font-semibold leading-7 text-[#74727e]">
            Send your question or email us at{" "}
            <a href="mailto:support@boodoo.app" className="font-black text-[#ff5865]">
              support@boodoo.app
            </a>
            .
          </p>
        </Reveal>
        <Reveal delay={0.04}>
          <QuestionForm />
        </Reveal>
      </section>

      <footer className="border-t border-[#ead8da] bg-white py-9">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm font-bold text-[#74727e] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <a href="#" className="flex items-center gap-3 text-[#30303d]">
            <Image src="/icons/boodoo-icon.png" alt="" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-black">BooDoo</span>
          </a>
          <p>BooDoo provides educational information and is not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </main>
  );
}

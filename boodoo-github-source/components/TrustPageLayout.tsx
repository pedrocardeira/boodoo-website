import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import type { ReactNode } from "react";

const appStoreUrl = "https://apps.apple.com/us/app/boodoo/id6784456363";

type TrustPageLayoutProps = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  children: ReactNode;
};

export default function TrustPageLayout({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  children
}: TrustPageLayoutProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f6f4] text-[#30303d]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/70 bg-[#f7f6f4]/82 backdrop-blur-2xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="BooDoo home">
            <Image
              src="/icons/boodoo-icon.png"
              alt=""
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span className="text-xl font-black tracking-normal text-[#30303d]">BooDoo</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-bold text-[#696875] md:flex">
            <Link href="/about" className="transition hover:text-[#ff5865]">
              About
            </Link>
            <Link href="/medical-sources" className="transition hover:text-[#ff5865]">
              Medical sources
            </Link>
            <Link href="/#features" className="transition hover:text-[#ff5865]">
              Features
            </Link>
            <Link href="/#pricing" className="transition hover:text-[#ff5865]">
              Pricing
            </Link>
          </div>

          <a
            href={appStoreUrl}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ff5865] px-5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(255,88,101,0.28)] transition hover:bg-[#e24752] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5865]"
          >
            <Download size={17} aria-hidden="true" />
            Download
          </a>
        </nav>
      </header>

      <section className="relative pt-28 sm:pt-32">
        <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_20%_20%,rgba(255,88,101,0.18),transparent_28%),linear-gradient(180deg,#fff_0%,#f7f6f4_88%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
          <div className="max-w-3xl">
            <p className="mb-7 inline-flex items-center rounded-full border border-[#ffd9dd] bg-white/78 px-4 py-2 text-sm font-extrabold text-[#ff5865] shadow-sm">
              {eyebrow}
            </p>
            <h1 className="text-5xl font-black leading-[0.95] tracking-normal text-[#2f2f3d] sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-[#696875] sm:text-xl">
              {intro}
            </p>
          </div>

          <div className="relative mx-auto flex w-full justify-center">
            <div className="absolute inset-y-14 left-1/2 w-[32rem] -translate-x-1/2 rounded-full bg-[#ff5865]/12 blur-3xl" />
            <div className="phone-frame relative">
              <Image
                src={image}
                alt={imageAlt}
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

      {children}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 rounded-[2.2rem] bg-[#ff5865] p-8 text-white shadow-[0_32px_90px_rgba(255,88,101,0.28)] md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <h2 className="text-4xl font-black tracking-normal sm:text-5xl">
              Log simply. Understand better.
            </h2>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/85">
              Track feeding, sleep, poop and growth with BooDoo on iPhone and iPad.
            </p>
          </div>
          <a
            href={appStoreUrl}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#30303d] shadow-[0_18px_45px_rgba(48,48,61,0.08)] transition hover:text-[#ff5865] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Download size={18} aria-hidden="true" />
            Download on the App Store
          </a>
        </div>
      </section>

      <footer className="border-t border-[#ead8da] bg-white py-9">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 text-sm font-bold text-[#74727e] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3 text-[#30303d]">
            <Image src="/icons/boodoo-icon.png" alt="" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-black">BooDoo</span>
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/about" className="hover:text-[#ff5865]">About</Link>
            <Link href="/medical-sources" className="hover:text-[#ff5865]">Medical sources</Link>
            <Link href="/privacy" className="hover:text-[#ff5865]">Privacy</Link>
            <a href="mailto:support@boodoo.app" className="hover:text-[#ff5865]">Contact</a>
          </nav>
          <p className="max-w-xl">BooDoo provides educational information and is not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </main>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 font-black text-[#ff5865] hover:text-[#e24752]">
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

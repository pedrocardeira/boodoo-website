import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { allTrackerPages } from "../lib/tracker-pages";

export default function SeoResourceLinks() {
  return (
    <section className="border-y border-[#f1d7da] bg-white/70 py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">
          Baby tracking guides
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-normal text-[#30303d] sm:text-5xl">
          Track every part of your baby's day.
        </h2>
        <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-[#74727e]">
          Learn how BooDoo brings feeding, sleep, poop and growth into one clear newborn record.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {allTrackerPages.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="group rounded-[1.6rem] border border-[#f4d5d8] bg-white p-5 shadow-[0_18px_48px_rgba(48,48,61,0.06)] transition hover:-translate-y-1 hover:border-[#ffadb5]"
            >
              <h3 className="text-lg font-black text-[#30303d] group-hover:text-[#ff5865]">
                {page.eyebrow}
              </h3>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#ff5865]">
                Learn more
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

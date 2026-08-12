import Link from "next/link";
import { ArrowRight } from "lucide-react";

const resources = [
  {
    href: "/best-baby-tracker-apps",
    title: "Best baby tracker apps",
    text: "Compare five different approaches to daily baby tracking."
  },
  {
    href: "/free-baby-tracker-app",
    title: "Free baby tracker app",
    text: "See what you can track before deciding whether Pro is useful."
  },
  {
    href: "/baby-tracker-iphone",
    title: "Baby tracker for iPhone",
    text: "Explore BooDoo’s one-tap iPhone and iPad workflow."
  },
  {
    href: "/huckleberry-alternative",
    title: "BooDoo vs Huckleberry",
    text: "Choose between a focused daily tracker and deeper sleep tools."
  },
  {
    href: "/baby-feeding-log-template",
    title: "Printable feeding log",
    text: "Type, print or download BooDoo when paper becomes difficult."
  }
];

export default function TrafficResourceLinks() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" aria-labelledby="traffic-resources-title">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff5865]">
        Guides and free tools
      </p>
      <h2 id="traffic-resources-title" className="mt-3 max-w-3xl text-4xl font-black text-[#30303d] sm:text-5xl">
        Choose a tracker—and start with a useful record.
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Link
            key={resource.href}
            href={resource.href}
            className="group rounded-[1.7rem] border border-[#f4d5d8] bg-white p-6 shadow-[0_18px_48px_rgba(48,48,61,0.06)] transition hover:-translate-y-1 hover:border-[#ffadb5]"
          >
            <h3 className="text-xl font-black text-[#30303d] group-hover:text-[#ff5865]">
              {resource.title}
            </h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#74727e]">{resource.text}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#ff5865]">
              Open resource
              <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

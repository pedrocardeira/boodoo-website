import type { Metadata } from "next";
import TrackerLandingPage from "../../components/TrackerLandingPage";
import { trackerPages } from "../../lib/tracker-pages";

const page = trackerPages.poop;

export const metadata: Metadata = {
  title: page.metadataTitle,
  description: page.description,
  alternates: { canonical: `/${page.slug}` },
  openGraph: {
    title: page.metadataTitle,
    description: page.description,
    url: `https://www.boodoo.app/${page.slug}`,
    siteName: "BooDoo",
    images: [{ url: page.image, width: 1242, height: 2688, alt: page.imageAlt }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: page.metadataTitle,
    description: page.description,
    images: [page.image]
  }
};

export default function BabyPoopTrackerPage() {
  return <TrackerLandingPage page={page} />;
}

import type { Metadata } from "next";
import TrafficLandingPage from "../../components/TrafficLandingPage";
import { trafficPages } from "../../lib/traffic-pages";

const page = trafficPages.feedingDiaperLog;

export const metadata: Metadata = {
  title: page.metadataTitle,
  description: page.description,
  alternates: { canonical: `/${page.slug}` },
  openGraph: {
    title: page.metadataTitle,
    description: page.description,
    url: `https://www.boodoo.app/${page.slug}`,
    type: "article",
    images: ["/screenshots/01-dashboard-photo-sources.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: page.metadataTitle,
    description: page.description,
    images: ["/screenshots/01-dashboard-photo-sources.png"]
  }
};

export default function NewbornFeedingAndDiaperLogPage() {
  return <TrafficLandingPage page={page} />;
}

import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const title = "BooDoo - Evidence-Based Baby Tracking";
const description = "Track feeds, sleep, diapers, growth and milestones with trusted medical guidance built into every recommendation.";

export const metadata: Metadata = {
  metadataBase: new URL("https://boodoo.app"),
  title,
  description,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title,
    description,
    url: "https://boodoo.app",
    siteName: "BooDoo",
    images: [
      {
        url: "/screenshots/01-dashboard-photo-sources.png",
        width: 1242,
        height: 2688,
        alt: "BooDoo app dashboard screenshot"
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
  },
  icons: {
    icon: "/icons/boodoo-icon.png",
    apple: "/icons/boodoo-icon.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

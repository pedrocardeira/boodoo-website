import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
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
        <Script
  src="https://www.googletagmanager.com/gtag/js?id=G-VFPW0E83FF"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-VFPW0E83FF');
  `}
</Script>
      </body>
    </html>
  );
}

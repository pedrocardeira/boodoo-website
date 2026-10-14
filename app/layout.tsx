import type { Metadata, Viewport } from "next";
import PublicAnalytics from "@/components/v2/analytics";

import "./globals.css";
import "./v2.css";
import "./family.css";

const title = "Boodoo | Little Days. Lifelong Memories.";

const description =
  "Understand your logged care data with Ask BooDoo. An app that adapts from pregnancy to baby to toddler, with shared records across multiple iPhones. Android is next.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.boodoo.app"),
  title,
  description,

  itunes: {
    appId: "6784456363",
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title,
    description,
    url: "https://www.boodoo.app",
    siteName: "BooDoo",
    images: [
      {
        url: "/screenshots/v2/app-3999.webp",
        width: 900,
        height: 1955,
        alt: "BooDoo app dashboard screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/screenshots/v2/app-3999.webp"],
  },

  icons: {
    icon: "/icons/boodoo-icon.png",
    apple: "/icons/boodoo-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#26262b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
        <PublicAnalytics />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import PublicAnalytics from "@/components/v2/analytics";

import "./globals.css";
import "./v2.css";
import "./family.css";

const title = "Boodoo | Little Days. Lifelong Memories.";

const description =
  "Track feeding, sleep, care, growth, and milestones. Get insights from your logged records with Ask BooDoo and follow your child’s development from pregnancy through childhood.";

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
        url: "/screenshots/v2/app-4088.webp",
        width: 1000,
        height: 2173,
        alt: "BooDoo app stages from pregnancy through childhood",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/screenshots/v2/app-4088.webp"],
  },

  icons: {
    icon: "/icons/boodoo-mark.png",
    apple: "/icons/boodoo-mark.png",
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

'use client';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
export default function PublicAnalytics(){const path=usePathname();if(path.startsWith('/family'))return null;return <><Script src="https://www.googletagmanager.com/gtag/js?id=G-VFPW0E83FF" strategy="afterInteractive"/><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-VFPW0E83FF');`}</Script><Analytics/></>}

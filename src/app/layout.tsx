import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bskystats.me'),
  title: {
    default: 'bskyStats.me - Bluesky Analytics & Engagement Metrics',
    template: '%s | bskyStats.me'
  },
  description: 'Free analytics tool for Bluesky accounts. Track engagement metrics, analyze likes, reposts, replies, and discover top performing content for public accounts.',
  keywords: ['bluesky', 'analytics', 'social media', 'engagement metrics', 'post analytics', 'bsky', 'statistics'],
  authors: [{ name: 'Ryan Powers', url: 'https://bsky.app/profile/ryanpowers.bsky.social' }],
  icons: {
    icon: '/browser_icon.png',
    apple: '/logo_square.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bskystats.me',
    title: 'bskyStats.me - Bluesky Analytics & Engagement Metrics',
    description: 'Free analytics tool for Bluesky accounts. Track engagement metrics, analyze likes, reposts, replies, and discover top performing content.',
    siteName: 'bskyStats.me',
    images: [{
      url: '/logo_square.png',
      width: 1200,
      height: 1200,
      alt: 'bskyStats.me Logo'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'bskyStats.me - Bluesky Analytics',
    description: 'Free analytics tool for Bluesky posts and engagement metrics',
    images: ['/logo_square.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google49a04e86fa383ad7',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

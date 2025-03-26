import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "bskyStats",
  description: "Analyze engagement metrics for Bluesky posts",
  icons: {
    icon: "/browser_icon.png"
  },
  openGraph: {
    title: 'bskyStats',
    description: 'Analyze engagement metrics for Bluesky posts',
    images: [{
      url: '/logo_square.png',
      width: 1200,
      height: 1200,
      alt: 'bskyStats'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'bskyStats',
    description: 'Analyze engagement metrics for Bluesky posts',
    images: ['/logo_square.png']
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
      </body>
    </html>
  );
}

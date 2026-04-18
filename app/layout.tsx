import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} | Recruitment & Executive Headhunting Malaysia`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "recruitment malaysia",
    "executive headhunting",
    "career coaching",
    "HR consulting",
    "talent acquisition",
    "recruitment agency malaysia",
    "headhunter malaysia",
  ],
  authors: [{ name: site.legalName }],
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: site.url,
    siteName: site.name,
    title: `${site.legalName} | Boutique Recruitment Specialists`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.legalName} | Boutique Recruitment Specialists`,
    description: site.description,
  },
  alternates: {
    canonical: site.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0f2341" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-MY" className={`${inter.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}

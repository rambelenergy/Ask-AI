import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/language/language-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | RamBelEnergy",
    default: "RamBelEnergy | Algeria–Europe Energy Intelligence",
  },
  description:
    "Professional analysis on Algeria–Europe energy relations, sustainability, and Mediterranean energy security. Independent research, strategic insight, and editorial intelligence.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "RamBelEnergy | Algeria–Europe Energy Intelligence",
    description:
      "Professional analysis on Algeria–Europe energy relations, sustainability, and Mediterranean energy security.",
    type: "website",
    siteName: "RamBelEnergy",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071a2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

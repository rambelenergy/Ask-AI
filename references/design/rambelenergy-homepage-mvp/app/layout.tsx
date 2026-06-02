import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RamBelEnergy | Algeria–Europe Energy Analysis",
  description:
    "Independent analysis on Algeria–Europe energy relations, sustainability, and Mediterranean energy security.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

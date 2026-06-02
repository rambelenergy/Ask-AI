import Link from "next/link";
import { focusAreas, navItems } from "@/data/homepage";
import { getSiteContentByKey } from "@/lib/site-content";
import { Mail, Globe, MapPin, ArrowUpRight } from "lucide-react";
import { T } from "@/components/language/t";

export async function Footer() {
  const footerBlock = await getSiteContentByKey("footer");
  const footer = footerBlock?.content_json as Record<string, string> | undefined;

  const tagline = footer?.tagline || "Professional energy analysis and sustainability intelligence focused on Algeria–Europe relations and Mediterranean energy security.";
  const copyright = footer?.copyright || "RamBelEnergy. All rights reserved.";

  return (
    <footer className="bg-[var(--navy)] text-white">
      {/* Top gradient accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--green)]/60 to-transparent" />

      <div className="container-page py-16 lg:py-20">
        {/* Main grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-85">
              <img
                src="/logo.png"
                alt="RamBelEnergy"
                className="h-9 w-auto brightness-0 invert"
              />
              <span className="text-xl font-bold tracking-[-0.02em]">RamBelEnergy</span>
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-[1.75] text-slate-300">
              {tagline}
            </p>
            <div className="mt-6 flex items-center gap-2 text-[13px] text-slate-400">
              <Globe size={14} className="shrink-0" />
              <span>rambelenergy.com</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
              <T k="footer.navHeading" />
            </h3>
            <ul className="space-y-3">
              {navItems.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-[14px] text-slate-300 transition-colors hover:text-white"
                  >
                    <span className="block h-px w-0 bg-[var(--gold)] transition-all duration-300 group-hover:w-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus Areas */}
          <div>
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
              <T k="footer.focusHeading" />
            </h3>
            <ul className="space-y-3">
              {focusAreas.slice(0, 5).map((area) => (
                <li key={area.title} className="text-[14px] text-slate-300">
                  {area.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
              <T k="footer.contactHeading" />
            </h3>
            <ul className="space-y-3.5 text-[14px]">
              <li className="flex items-start gap-2.5 text-slate-300">
                <MapPin size={15} className="mt-0.5 shrink-0 text-slate-500" />
                <span><T k="footer.location" /></span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Mail size={15} className="shrink-0 text-slate-500" />
                <span>contact@rambelenergy.com</span>
              </li>
              <li className="pt-1 text-[13px] leading-relaxed text-slate-400">
                <T k="footer.inquiries" />
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--gold)] transition-colors hover:text-white"
            >
              <T k="footer.getInTouch" />
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-page flex flex-col items-center gap-3 py-5 sm:flex-row sm:justify-between">
          <p className="text-[12px] text-slate-400">
            &copy; {new Date().getFullYear()} {copyright}
          </p>
          <div className="flex items-center gap-6 text-[12px] text-slate-500">
            <Link href="/about" className="transition-colors hover:text-slate-300">
              About
            </Link>
            <Link href="/analysis" className="transition-colors hover:text-slate-300">
              Analysis
            </Link>
            <Link href="/research" className="transition-colors hover:text-slate-300">
              Research
            </Link>
            <Link href="/contact" className="transition-colors hover:text-slate-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

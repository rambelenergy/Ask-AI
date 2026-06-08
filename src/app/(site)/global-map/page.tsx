import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ExternalLink, Sun, Map } from "lucide-react";
import { T } from "@/components/language/t";

export const metadata: Metadata = {
  title: "Global Solar Map",
  description:
    "Explore solar resource and photovoltaic power potential data for Algeria and other regions through the Global Solar Atlas.",
};

const ATLAS_URL = "https://globalsolaratlas.info/map?s=30.446988,0.225220&m=site";

export default function GlobalMapPage() {
  return (
    <>
      {/* Breadcrumb */}
      <section className="section-light border-b border-[var(--line)]">
        <div className="container-page py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="breadcrumb mb-6">
            <Link href="/"><T k="common.home" /></Link>
            <ChevronRight size={14} className="text-[var(--line)]" />
            <span className="current"><T k="nav.globalMap" /></span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--green)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--green)]">
                <Sun size={13} />
                <T k="globalMap.interactiveBadge" />
              </div>
              <h1 className="heading-xl"><T k="globalMap.heading" /></h1>
              <p className="body-lg mt-5 max-w-[620px]">
                <T k="globalMap.description" />
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={ATLAS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-lg bg-[var(--green)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0e4d42] hover:shadow-md"
                >
                  <ExternalLink size={16} />
                  <T k="globalMap.openMap" />
                </a>
                <a
                  href="https://globalsolaratlas.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-lg border border-[var(--line)] bg-white px-6 py-3.5 text-sm font-semibold text-[var(--navy)] transition hover:border-slate-300 hover:shadow-sm"
                >
                  <Map size={16} />
                  <T k="globalMap.homeLink" />
                </a>
              </div>
            </div>

            {/* Visual card */}
            <div className="relative overflow-hidden rounded-xl border border-[var(--line)]">
              <img
                src="/global-map.jpeg"
                alt="Global Solar Atlas — solar resource mapping"
                className="h-[260px] w-full object-cover sm:h-[320px]"
                loading="lazy"
                decoding="async"
              />
              {/* Bottom bar */}
              <div className="border-t border-[var(--line)] bg-white px-5 py-3 text-center text-xs text-[var(--muted)]">
                <T k="globalMap.coordinatesLabel" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info section */}
      <section className="section-py">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="professional-card p-7">
              <h3 className="text-lg font-bold text-[var(--navy)]"><T k="globalMap.solarDataTitle" /></h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                <T k="globalMap.solarDataDesc" />
              </p>
            </div>
            <div className="professional-card p-7">
              <h3 className="text-lg font-bold text-[var(--navy)]"><T k="globalMap.interactiveTitle" /></h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                <T k="globalMap.interactiveDesc" />
              </p>
            </div>
            <div className="professional-card p-7">
              <h3 className="text-lg font-bold text-[var(--navy)]"><T k="globalMap.algeriaFocusTitle" /></h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                <T k="globalMap.algeriaFocusDesc" />
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { T } from "@/components/language/t";
import { ExternalLink, Sun, Globe } from "lucide-react";

const SOLAR_ATLAS_URL = "https://globalsolaratlas.info/map?s=30.446988,0.225220&m=site";

export function GlobalSolarMapCard() {
  return (
    <section className="container-page section-py" id="solar-map">
      <div className="mb-10">
        <p className="eyebrow mb-3"><T k="home.solarMap.eyebrow" /></p>
        <h2 className="heading-lg"><T k="home.solarMap.heading" /></h2>
        <p className="body-lg mt-4 max-w-[680px]">
          <T k="home.solarMap.desc" />
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        {/* Left: card */}
        <a
          href={SOLAR_ATLAS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="professional-card group relative flex flex-col overflow-hidden p-8 sm:flex-row sm:items-center sm:gap-8 sm:p-10"
        >
          {/* Icon */}
          <div className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--green)] to-[#0e4d42] text-white shadow-md transition-transform duration-300 group-hover:scale-105 sm:mb-0">
            <Globe size={28} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="tag tag-green inline-flex items-center gap-1.5">
                <Sun size={10} />
                <T k="globalMap.interactiveBadge" />
              </span>
              <span className="text-[12px] font-semibold text-slate-500">
                Global Solar Atlas
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-[-0.02em] text-[var(--navy)]">
              <T k="globalMap.heading" />
            </h3>
            <p className="mt-2 max-w-[600px] text-[14px] leading-[1.7] text-[var(--muted)]">
              <T k="globalMap.description" />
            </p>
          </div>

          {/* Action */}
          <div className="mt-6 flex shrink-0 items-center gap-2 rounded-lg bg-[var(--green)] px-5 py-3 text-[13px] font-semibold text-white transition-all duration-300 group-hover:bg-[#0e4d42] group-hover:shadow-md sm:mt-0">
            <T k="globalMap.openMap" />
            <ExternalLink size={15} />
          </div>
        </a>

        {/* Right: image */}
        <img
          src="/global-map.jpeg"
          alt="Global solar map visualization"
          className="hidden rounded-xl border border-[var(--line)] object-cover shadow-sm lg:block"
          style={{ width: "320px", height: "100%", maxHeight: "200px" }}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}

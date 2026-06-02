import { globalSolarMapResource } from "@/data/renewable-energy-sources";
import { ExternalLink, Map, Sun } from "lucide-react";

export function GlobalSolarMapCard() {
  return (
    <section className="container-page section-py" id="solar-map">
      <div className="mb-10">
        <p className="eyebrow mb-3">Explore Solar Potential</p>
        <h2 className="heading-lg">Global Solar Map</h2>
        <p className="body-lg mt-4 max-w-[680px]">
          Explore solar resource and photovoltaic power potential data for Algeria and other regions through the Global Solar Atlas.
        </p>
      </div>

      <a
        href={globalSolarMapResource.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Global Solar Atlas in a new tab — External Interactive Resource"
        className="professional-card group relative flex flex-col overflow-hidden p-8 sm:flex-row sm:items-center sm:gap-8 sm:p-10"
      >
        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--green)] to-[#0e4d42] text-white shadow-md transition-transform duration-300 group-hover:scale-105 sm:mb-0">
          <Map size={28} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="tag tag-green inline-flex items-center gap-1.5">
              <Sun size={10} />
              {globalSolarMapResource.badge}
            </span>
            <span className="text-[12px] font-semibold text-slate-500">
              {globalSolarMapResource.source}
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-[-0.02em] text-[var(--navy)]">
            {globalSolarMapResource.title}
          </h3>
          <p className="mt-2 max-w-[600px] text-[14px] leading-[1.7] text-[var(--muted)]">
            {globalSolarMapResource.description ||
              "Interactive map showing solar irradiance and PV potential for Algeria and surrounding regions."}
          </p>
        </div>

        {/* Action */}
        <div className="mt-6 flex shrink-0 items-center gap-2 rounded-lg bg-[var(--green)] px-5 py-3 text-[13px] font-semibold text-white transition-all duration-300 group-hover:bg-[#0e4d42] group-hover:shadow-md sm:mt-0">
          Open Global Solar Map
          <ExternalLink size={15} />
        </div>
      </a>
    </section>
  );
}

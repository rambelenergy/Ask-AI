import {
  Zap,
  GraduationCap,
  Heart,
  Users,
  Briefcase,
  Plug,
  Globe,
  Landmark,
} from "lucide-react";
import { ExternalSourceCard } from "@/components/resources/ExternalSourceCard";
import {
  developmentCategories,
  energyDevelopmentSources,
} from "@/data/energy-development-sources";

const categoryIcons: Record<string, React.ReactNode> = {
  "Energy & Development": <Zap size={13} />,
  "Energy and Education": <GraduationCap size={13} />,
  "Energy and Healthcare": <Heart size={13} />,
  "Women and Energy": <Users size={13} />,
  "Green Jobs": <Briefcase size={13} />,
  "Rural Electrification": <Plug size={13} />,
  "Sahel Development": <Globe size={13} />,
  "Trans-Saharan Gas Pipeline & Local Economic Impact": <Landmark size={13} />,
};

export function EnergyDevelopmentAfricaSection() {
  const displayedSources = energyDevelopmentSources.slice(0, 3);

  return (
    <section className="section-light section-py">
      <div className="container-page">
        {/* ── Eyebrow ── */}
        <p className="eyebrow mb-4">ENERGY ACCESS & HUMAN DEVELOPMENT</p>

        {/* ── Two-column layout ── */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          {/* ═══ LEFT: Title + intro + categories + supporting text ═══ */}
          <div>
            <h2 className="heading-lg mb-5">
              Energy & Development in Africa
            </h2>

            <p className="body-lg max-w-xl">
              Energy is not only a matter of markets, pipelines, and infrastructure.
              Across Africa and the Sahel, access to reliable energy can support
              education, healthcare, job creation, rural electrification, and
              long-term economic development.
            </p>

            {/* Category tags */}
            <div className="mt-7 flex flex-wrap gap-2">
              {developmentCategories.map((cat) => (
                <span
                  key={cat.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.01em] text-[var(--navy)] transition-colors duration-200 hover:border-[var(--green)]/30 hover:bg-[var(--green-soft)]"
                >
                  {categoryIcons[cat.label] ?? null}
                  {cat.label}
                </span>
              ))}
            </div>

            {/* Supporting text */}
            <p className="body-sm mt-7 max-w-xl border-l-[3px] border-[var(--green-muted)] pl-4 italic text-[var(--muted-soft)]">
              This section highlights how energy initiatives contribute to human
              development while remaining connected to RamBelEnergy&apos;s broader
              focus on energy, sustainability, and Africa–Europe strategic cooperation.
            </p>
          </div>

          {/* ═══ RIGHT: Source cards ═══ */}
          <div>
            {/* Selected source cards */}
            <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-1">
              {displayedSources.map((source) => (
                <ExternalSourceCard key={source.url} resource={source} />
              ))}
            </div>

            {/* Compact "more sources" link */}
            {energyDevelopmentSources.length > 3 && (
              <p className="mt-4 text-center text-[12px] font-medium text-[var(--muted-soft)]">
                +{energyDevelopmentSources.length - 3} additional development references
                available
              </p>
            )}
          </div>
        </div>

        {/* Dual images — full width below text */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <a
            href="https://www.worldbank.org/en/programs/energizing-africa"
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-lg border border-[var(--line)] transition hover:border-[var(--green)] hover:shadow-md"
          >
            <img
                src="/mission300Banner.webp"
                alt="Mission 300 — Energy access and development in Africa"
                className="w-full"
              />
            <div className="flex items-center justify-between bg-[var(--navy-soft)] px-4 py-2.5 transition-colors group-hover:bg-[var(--navy)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/80">
                Energy for People
              </span>
              <span className="text-[11px] font-medium text-[var(--green)]">
                Human Impact
              </span>
            </div>
          </a>
          <a
            href="https://www.afdb.org/en/topics-and-sectors/initiatives-and-partnerships/mission-300"
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-lg border border-[var(--line)] transition hover:border-[var(--green)] hover:shadow-md"
          >
            <img
                src="/mission300latestebanner.webp"
                alt="Mission 300 — Energy access and development in Africa"
                className="w-full"
              />
            <div className="flex items-center justify-between bg-[var(--navy-soft)] px-4 py-2.5 transition-colors group-hover:bg-[var(--navy)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/80">
                Energy &amp; Development Context
              </span>
              <span className="text-[11px] font-medium text-[var(--green)]">
                Africa &amp; Sahel
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

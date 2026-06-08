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
import { T } from "@/components/language/t";
import type { TranslationKey } from "@/lib/i18n/types";
import { ExternalSourceCard } from "@/components/resources/ExternalSourceCard";
import { energyDevelopmentSources } from "@/data/energy-development-sources";

const categoryItems: { key: TranslationKey; icon: React.ReactNode }[] = [
  { key: "home.energyDev.catEnergyDev", icon: <Zap size={13} /> },
  { key: "home.energyDev.catEducation", icon: <GraduationCap size={13} /> },
  { key: "home.energyDev.catHealthcare", icon: <Heart size={13} /> },
  { key: "home.energyDev.catWomen", icon: <Users size={13} /> },
  { key: "home.energyDev.catGreenJobs", icon: <Briefcase size={13} /> },
  { key: "home.energyDev.catRural", icon: <Plug size={13} /> },
  { key: "home.energyDev.catSahel", icon: <Globe size={13} /> },
  { key: "home.energyDev.catTransSaharan", icon: <Landmark size={13} /> },
];

export function EnergyDevelopmentAfricaSection() {
  const displayedSources = energyDevelopmentSources.slice(0, 3);

  return (
    <section className="section-light section-py">
      <div className="container-page">
        {/* ── Eyebrow ── */}
        <p className="eyebrow mb-4"><T k="home.energyDev.eyebrow" /></p>

        {/* ── Two-column layout ── */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          {/* ═══ LEFT: Title + intro + categories + supporting text ═══ */}
          <div>
            <h2 className="heading-lg mb-5">
              <T k="home.energyDev.heading" />
            </h2>

            <p className="body-lg max-w-xl">
              <T k="home.energyDev.description" />
            </p>

            {/* Category tags */}
            <div className="mt-7 flex flex-wrap gap-2">
              {categoryItems.map((cat) => (
                <span
                  key={cat.key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.01em] text-[var(--navy)] transition-colors duration-200 hover:border-[var(--green)]/30 hover:bg-[var(--green-soft)]"
                >
                  {cat.icon}
                  <T k={cat.key} />
                </span>
              ))}
            </div>

            {/* Supporting text */}
            <p className="body-sm mt-7 max-w-xl border-l-[3px] border-[var(--green-muted)] pl-4 italic text-[var(--muted-soft)]">
              <T k="home.energyDev.supportingText" />
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
                +{energyDevelopmentSources.length - 3} <T k="home.energyDev.moreSources" />
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
                loading="lazy"
                decoding="async"
              />
            <div className="flex items-center justify-between bg-[var(--navy-soft)] px-4 py-2.5 transition-colors group-hover:bg-[var(--navy)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/80">
                <T k="home.energyDev.img1Label" />
              </span>
              <span className="text-[11px] font-medium text-[var(--green)]">
                <T k="home.energyDev.img1Badge" />
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
                loading="lazy"
                decoding="async"
              />
            <div className="flex items-center justify-between bg-[var(--navy-soft)] px-4 py-2.5 transition-colors group-hover:bg-[var(--navy)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/80">
                <T k="home.energyDev.img2Label" />
              </span>
              <span className="text-[11px] font-medium text-[var(--green)]">
                <T k="home.energyDev.img2Badge" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

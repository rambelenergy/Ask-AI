import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCarousel } from "@/components/content/ArticleCarousel";
import { HomeSlogan } from "@/components/home/HomeSlogan";
import { SaharaRenewableSection } from "@/components/home/SaharaRenewableSection";
import { EnergyDevelopmentAfricaSection } from "@/components/home/EnergyDevelopmentAfricaSection";
import { GlobalSolarMapCard } from "@/components/resources/GlobalSolarMapCard";
import { CTASection } from "@/components/content/CTASection";
import { FocusAreaCard } from "@/components/content/FocusAreaCard";
import { HomeAssistantSection } from "@/components/content/HomeAssistantSection";
import { T } from "@/components/language/t";
import { getSiteContentByKey } from "@/lib/site-content";
import { getAboutSectionByKey } from "@/lib/about-sections";
import { getPublishedArticles } from "@/lib/articles";
import {
  focusAreas as fallbackFocusAreas,
} from "@/data/homepage";

export default async function HomePage() {
  const [pipelineBlock, missionBlock, focusBlock, ctaBlock, profileSection] =
    await Promise.all([
      getSiteContentByKey("homepage_pipeline_highlight"),
      getSiteContentByKey("homepage_mission"),
      getSiteContentByKey("homepage_energy_focus"),
      getSiteContentByKey("contact_cta"),
      getAboutSectionByKey("profile"),
    ]);

  const [articles] = await Promise.all([
    getPublishedArticles(),
  ]);

  const pipeline = pipelineBlock?.content_json as Record<string, string> | undefined;
  const mission = missionBlock?.content_json as Record<string, string> | undefined;
  const focusAreas = focusBlock?.content_json as Array<{ title: string; description: string }> | undefined;
  const cta = ctaBlock?.content_json as Record<string, string> | undefined;
  const summarize =
    profileSection?.content_json && typeof profileSection.content_json.summarize === "string"
      ? profileSection.content_json.summarize
      : "";

  const focusList = focusAreas?.length ? focusAreas : fallbackFocusAreas;

  const profileSummarize =
    summarize ||
    "Born in Sétif, Algeria, Ramdane Belamri is a journalist, PhD holder, and analyst focusing on energy, geopolitics, sustainability, and Euro-African cooperation. With over twenty-five years of experience across print, television, and digital media, he has built a career combining journalism and academic research. He earned a PhD in Media and Communication Sciences from the University of Algiers 3 and is currently pursuing an international doctoral degree at the University of Seville.";

  const ctaTitle = cta?.title || "Research, Media & Strategic Energy Collaboration";
  const ctaDesc =
    cta?.description ||
    "For research inquiries, institutional discussions, or strategic energy collaboration, contact RamBelEnergy.";
  const ctaLabel = cta?.button_label || "Contact";
  const ctaHref = cta?.button_href || "/contact";

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          ASK ENERGY
          ═══════════════════════════════════════════════════════════ */}
      <HomeAssistantSection />

      {/* ═══════════════════════════════════════════════════════════
          BRAND SLOGAN
          ═══════════════════════════════════════════════════════════ */}
      <HomeSlogan />

      {/* ═══════════════════════════════════════════════════════════
          LATEST ANALYSIS — IFRI-style publication grid
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-light section-py">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-3"><T k="home.analysis.eyebrow" /></p>
              <h2 className="heading-lg"><T k="home.analysis.heading" /></h2>
            </div>
            <Link href="/analysis" className="btn-ghost">
              <T k="home.analysis.viewAll" />
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-12">
            <ArticleCarousel articles={articles.slice(0, 4)} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          GLOBAL SOLAR MAP
          ═══════════════════════════════════════════════════════════ */}
      <GlobalSolarMapCard />

      {/* ═══════════════════════════════════════════════════════════
          SAHARA RENEWABLE
          ═══════════════════════════════════════════════════════════ */}
      <SaharaRenewableSection />

      {/* ═══════════════════════════════════════════════════════════
          ENERGY & DEVELOPMENT IN AFRICA
          ═══════════════════════════════════════════════════════════ */}
      <EnergyDevelopmentAfricaSection />

      {/* ═══════════════════════════════════════════════════════════
          ABOUT THE ANALYST
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-light section-py">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Portrait */}
          <div className="img-frame aspect-[3/4] max-h-[520px]">
            <img
              src="/about.jpeg"
              alt="Professional portrait of Ramdane Belamri"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Content */}
          <div className="lg:py-4">
            <p className="eyebrow mb-4"><T k="home.about.eyebrow" /></p>
            <h2 className="heading-lg"><T k="home.about.heading" /></h2>

            <p className="mt-6 text-xl font-medium leading-[1.75] text-[var(--navy)]">
              {profileSummarize}
            </p>

            <p className="mt-5 body-base max-w-xl">
              {mission?.text ||
                "RamBelEnergy aims to provide professional analysis, research, and strategic insight on Algeria–Europe energy relations, with a focus on gas infrastructure, energy security, solar energy, sustainability, and future cooperation between Africa and Europe."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about"
                className="btn-primary"
              >
                <T k="home.about.viewProfile" />
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ENERGY FOCUS AREAS
          ═══════════════════════════════════════════════════════════ */}
      <section id="energy-focus" className="section-py">
        <div className="container-page">
          <div className="mb-12">
            <p className="eyebrow mb-3"><T k="home.focus.eyebrow" /></p>
            <h2 className="heading-lg"><T k="home.focus.heading" /></h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {focusList.map((area) => (
              <FocusAreaCard
                key={area.title}
                area={area}
                href={area.title === "Solar Energy & Green Hydrogen" ? "#solar-hydrogen" : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════════════════ */}
      <CTASection
        title={ctaTitle}
        description={ctaDesc}
        buttonLabel={ctaLabel}
        buttonHref={ctaHref}
      />
    </>
  );
}

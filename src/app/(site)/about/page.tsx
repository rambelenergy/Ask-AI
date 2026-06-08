import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CTASection } from "@/components/content/CTASection";
import { getAllAboutSections } from "@/lib/about-sections";
import { aboutContent } from "@/data/about";
import { T } from "@/components/language/t";

export const metadata: Metadata = {
  title: "About",
};

type ProfileContent = {
  title: string;
  biography?: string;
  sumarize?: string;
  summarize?: string;
  replacement_note?: string;
  identities: { title: string }[];
};

type MissionContent = {
  title: string;
  text: string;
  points: { title: string; description: string }[];
};

type ValueItem = {
  title: string;
  description: string;
};

type FutureVisionContent = {
  text: string;
  badge: string;
  note: string;
};

export default async function AboutPage() {
  const sections = await getAllAboutSections();

  const sectionMap = sections.reduce<Record<string, Record<string, unknown>>>((acc, section) => {
    acc[section.section_key] = section.content_json as Record<string, unknown>;
    return acc;
  }, {});

  const profile = (sectionMap.profile as ProfileContent) || aboutContent.profile;
  const mission = (sectionMap.mission as MissionContent) || aboutContent.mission;
  const values = Array.isArray(sectionMap.values)
    ? (sectionMap.values as ValueItem[])
    : aboutContent.values;
  const futureVision = (sectionMap.future_vision as FutureVisionContent) || aboutContent.futureVision;

  const biographyText = profile.biography || profile.sumarize || "";

  return (
    <>
      {/* ═══════════════════════════════════════════════
          ANALYST PROFILE
          ═══════════════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-page">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "About" },
            ]}
          />
          <div className="mb-12">
            <p className="eyebrow mb-4"><T k="about.profile.eyebrow" /></p>
            <h2 className="heading-lg">{profile.title}</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            {/* Portrait */}
            <figure className="img-frame aspect-[3/4] max-h-[540px]">
              <img
                src="/about.jpeg"
                alt="Professional portrait of Ramdane Belamri"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </figure>

            {/* Biography */}
            <div className="professional-card-static p-8 sm:p-10">
              <div className="space-y-5">
                <div
                  className="body-base leading-[1.85]"
                  dangerouslySetInnerHTML={{ __html: biographyText }}
                />
              </div>

              {/* Identity cards */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {profile.identities.map((identity) => (
                  <div
                    key={identity.title}
                    className="feature-card rounded-l-md"
                  >
                    <p className="text-sm font-semibold leading-6 text-[var(--navy)]">
                      {identity.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MISSION
          ═══════════════════════════════════════════════ */}
      <section className="section-light section-py">
        <div className="container-page">
          <div className="mb-12">
            <p className="eyebrow mb-4"><T k="about.mission.eyebrow" /></p>
            <h2 className="heading-lg">{mission.title}</h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.92fr] lg:items-start">
            <p className="body-base max-w-xl text-[1.05rem] leading-[1.85]">
              {mission.text}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {mission.points.map((point, index) => (
                <div
                  key={point.title}
                  className="professional-card p-5 sm:p-6"
                >
                  <span className="mb-4 block text-xs font-bold uppercase tracking-[0.15em] text-[var(--green)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base font-semibold leading-6 text-[var(--navy)]">
                    {point.title}
                  </p>
                  <p className="body-sm mt-2">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          EDITORIAL VALUES
          ═══════════════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-page">
          <div className="mb-12">
            <p className="eyebrow mb-4"><T k="about.values.eyebrow" /></p>
            <h2 className="heading-lg"><T k="about.values.heading" /></h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="professional-card group p-6"
              >
                <span aria-hidden="true" className="mb-5 block h-0.5 w-8 bg-[var(--green)] transition-all duration-300 group-hover:w-12" />
                <p className="text-base font-semibold leading-6 text-[var(--navy)]">
                  {value.title}
                </p>
                <p className="body-sm mt-3">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FUTURE VISION
          ═══════════════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-page">
          <div className="professional-card-static grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_0.92fr] lg:p-12">
            <div>
              <p className="eyebrow mb-5"><T k="about.future.eyebrow" /></p>
              <h2 className="heading-lg">
                <T k="about.future.title" />
              </h2>
              <p className="body-base mt-6 max-w-xl">
                {futureVision.text}
              </p>
            </div>

            <aside
              aria-label="AI preview roadmap note"
              className="professional-card-static border-[var(--line)] bg-white p-6 sm:p-8"
            >
              <span className="tag tag-gold">{futureVision.badge}</span>
              <p className="mt-7 text-xl font-semibold leading-8 text-[var(--navy)]">
                {futureVision.note}
              </p>
              <p className="body-sm mt-5">
                <T k="about.future.aiNote" />
              </p>
              <ButtonLink href="/ai-assistant" variant="secondary" className="mt-7">
                <T k="about.future.viewAi" />
                <ArrowRight size={14} />
              </ButtonLink>
            </aside>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════ */}
      <CTASection
        title="Collaboration &amp; Inquiries"
        description="For research, media, institutional, or strategic energy discussions, contact RamBelEnergy."
        buttonLabel="Contact"
        buttonHref="/contact"
      />
    </>
  );
}

import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeading } from "@/components/SectionHeading";
import { AboutHeroVisual } from "@/components/about/AboutHeroVisual";
import { CoreFocusCard } from "@/components/about/CoreFocusCard";
import { EditorialValueCard } from "@/components/about/EditorialValueCard";
import { MissionPoint } from "@/components/about/MissionPoint";
import { ProfileIdentityCard } from "@/components/about/ProfileIdentityCard";
import { aboutContent } from "@/data/about";
import { focusAreas, navItems } from "@/data/homepage";

export default function AboutPage() {
  const { hero, profile, mission, focusAreas: coreFocusAreas, values, futureVision } = aboutContent;

  return (
    <>
      <Header items={navItems} activeHref="/about" />
      <main>
        <section className="border-b border-[var(--line)] bg-white py-12 sm:py-16 lg:py-20">
          <div className="container-page">
            <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-3 text-sm font-medium text-[var(--muted)]">
              <Link href="/" className="transition hover:text-[var(--green)]">Home</Link>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span aria-current="page" className="text-[var(--green)]">About</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
              <div className="max-w-2xl">
                <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--green)]">{hero.eyebrow}</p>
                <h1 className="text-[2.8rem] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--navy)] sm:text-[3.8rem] lg:text-[4.25rem]">
                  {hero.title}
                </h1>
                <p className="mt-7 text-lg leading-9 text-[var(--muted)] sm:text-[1.35rem]">
                  {hero.subtitle}
                </p>
                <div className="mt-10 border-t border-[var(--line)] pt-7">
                  <p className="max-w-xl text-base leading-8 text-[var(--muted)]">
                    A professional platform presenting editorial analysis, research perspective, and strategic energy intelligence across Algeria, Africa, and Europe.
                  </p>
                </div>
              </div>
              <AboutHeroVisual />
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container-page">
            <SectionHeading eyebrow="Analyst Profile" title={profile.title} align="left" />
            <div className="mt-12 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
              <figure className="relative min-h-[460px] border border-[var(--line)] bg-[#e7ece8] p-7">
                <div className="absolute inset-7 border border-[#cdd6d2] bg-[#eef2ef]" aria-hidden="true" />
                <div
                  role="img"
                  aria-label="Professional portrait placeholder for Mr. Ramdane"
                  className="absolute inset-x-12 top-12 h-[275px] bg-[#dce5e0]"
                >
                  <div className="mx-auto mt-12 h-20 w-20 rounded-full border border-[#bdcbc5] bg-[#eef2ef]" />
                  <div className="mx-auto mt-5 h-24 w-36 rounded-t-full border border-[#bdcbc5] bg-[#eef2ef]" />
                </div>
                <figcaption className="absolute inset-x-12 bottom-12 border border-[var(--line)] bg-[var(--paper)] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.17em] text-[var(--green)]">Portrait placeholder</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Approved portrait asset to be added later.</p>
                </figcaption>
              </figure>

              <div className="border border-[var(--line)] bg-white p-7 sm:p-10">
                <p className="max-w-3xl text-[1.45rem] font-medium leading-10 tracking-[-0.015em] text-[var(--navy)] sm:text-[1.65rem]">
                  {profile.biography}
                </p>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">
                  {profile.replacementNote}
                </p>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {profile.identities.map((identity) => (
                    <ProfileIdentityCard key={identity.title} item={identity} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--navy)] py-16 text-white sm:py-20 lg:py-24">
          <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-start">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Platform Mission</p>
              <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-[2.6rem]">
                {mission.title}
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {mission.text}
              </p>
            </div>
            <div className="border border-white/12 bg-white p-7 text-[var(--navy)] sm:p-9">
              <p className="mb-7 text-xs font-bold uppercase tracking-[0.18em] text-[var(--green)]">Key Mission Points</p>
              {mission.points.map((point, index) => (
                <MissionPoint key={point.title} point={point} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container-page">
            <SectionHeading eyebrow="Research Themes" title="Core Focus Areas" align="left" />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {coreFocusAreas.map((item) => (
                <CoreFocusCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-white py-16 sm:py-20 lg:py-24">
          <div className="container-page">
            <SectionHeading
              eyebrow="Editorial Principles"
              title="Editorial Values"
              description="A clear and restrained editorial approach designed for energy analysis, policy context, and professional readership."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <EditorialValueCard key={value.title} value={value} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container-page grid gap-8 border border-[var(--line)] bg-[var(--paper)] p-7 sm:p-10 lg:grid-cols-[1fr_0.92fr] lg:p-12">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--green)]">Future Vision</p>
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.035em] text-[var(--navy)] sm:text-[2.5rem]">
                From analysis platform to knowledge capabilities
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)]">
                {futureVision.text}
              </p>
            </div>
            <aside className="border border-[var(--line)] bg-white p-6 sm:p-8" aria-label="AI preview roadmap note">
              <p className="inline-flex bg-[#f6efe1] px-3 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#8f6729]">
                {futureVision.badge}
              </p>
              <p className="mt-7 text-xl font-semibold leading-8 text-[var(--navy)]">
                {futureVision.note}
              </p>
              <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
                Preview statement only. Full AI or RAG capability is not available in the Phase 1 frontend scope.
              </p>
              <ButtonLink href="/ai-preview" variant="secondary" className="mt-7">View AI Preview</ButtonLink>
            </aside>
          </div>
        </section>

        <CTASection
          title="Collaboration & Inquiries"
          description="For research, media, institutional, or strategic energy discussions, contact RamBelEnergy."
          buttonLabel="Contact"
          buttonHref="/contact"
        />
      </main>
      <Footer items={navItems} areas={focusAreas} />
    </>
  );
}

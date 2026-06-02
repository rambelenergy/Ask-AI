import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { CTASection } from "@/components/CTASection";
import { FocusAreaCard } from "@/components/FocusAreaCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroRouteVisual } from "@/components/HeroRouteVisual";
import { PublicationCard } from "@/components/PublicationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { focusAreas, latestArticles, navItems, publications, strategicItems } from "@/data/homepage";

export default function HomePage() {
  return (
    <>
      <Header items={navItems} />
      <main>
        <section className="bg-[var(--navy)] py-10 text-white sm:py-14 lg:py-16">
          <div className="container-page grid gap-10 lg:grid-cols-[1.01fr_0.99fr] lg:items-stretch">
            <div className="flex flex-col justify-center py-4 lg:py-8">
              <p className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
                Algeria–Europe Energy Intelligence
              </p>
              <h1 className="max-w-2xl text-[2.7rem] font-bold leading-[1.06] tracking-[-0.05em] sm:text-[3.65rem] lg:text-[4.15rem]">
                Independent Analysis on Algeria–Europe Energy Relations
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                A professional platform for energy analysis, sustainability intelligence, and strategic insight connecting Algeria, Africa, and Europe.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/analysis" className="bg-[var(--green)] px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#0e4b40]">
                  Read Latest Analysis
                </Link>
                <Link href="#energy-focus" className="border border-white/25 px-6 py-4 text-center text-sm font-semibold text-white transition hover:border-white/50">
                  Explore Energy Focus
                </Link>
              </div>
            </div>
            <HeroRouteVisual />
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container-page">
            <SectionHeading
              eyebrow="Featured Strategic Focus"
              title="Nigeria–Algeria–Europe Gas Pipeline"
              description="The proposed corridor represents a strategic connection between African energy resources and European energy security needs, with Italy and Spain as important destinations."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {strategicItems.map((item, index) => (
                <article key={item.title} className="border border-[var(--line)] bg-[var(--paper)] p-6">
                  <p className="mb-6 text-xs font-bold uppercase tracking-[0.17em] text-[var(--gold)]">
                    0{index + 1}
                  </p>
                  <h3 className="text-xl font-bold leading-tight text-[var(--navy)]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-white py-16 sm:py-20 lg:py-24">
          <div className="container-page">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Latest Analysis" title="Recent insight and commentary" align="left" />
              <Link href="/analysis" className="text-sm font-semibold text-[var(--green)]">View all analysis →</Link>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {latestArticles.map((article) => (
                <ArticleCard key={article.title} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container-page">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Research & Publications" title="Briefs, reports, and research notes" align="left" />
              <Link href="/research" className="text-sm font-semibold text-[var(--green)]">Browse publications →</Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {publications.map((publication) => (
                <PublicationCard key={publication.title} publication={publication} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-white py-16 sm:py-20 lg:py-24">
          <div className="container-page grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
            <div className="relative min-h-[430px] bg-[#e7ece8]">
              <div className="absolute inset-8 border border-[#ccd7d0] bg-[#eef2ef]" />
              <div className="absolute inset-x-10 bottom-10 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--green)]">Portrait Placeholder</p>
                <p className="mt-3 text-sm text-[var(--muted)]">Professional analyst portrait area</p>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.19em] text-[var(--green)]">About Founder</p>
              <h2 className="text-3xl font-bold tracking-[-0.035em] text-[var(--navy)] sm:text-[2.5rem]">Ramdane Belamri</h2>
              <p className="mt-7 max-w-xl text-xl font-medium leading-9 text-[var(--navy)]">
                Journalist, PhD holder, and analyst focusing on energy, geopolitics, sustainability, and Euro-African cooperation.
              </p>
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)]">
                RamBelEnergy provides a professional space for structured commentary and research-oriented perspectives on regional energy questions.
              </p>
              <Link href="/about" className="mt-9 inline-flex bg-[var(--green)] px-6 py-4 text-sm font-semibold text-white hover:bg-[#0e4b40]">
                View Profile
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container-page grid gap-9 border border-[var(--line)] bg-[var(--paper)] p-7 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
            <div>
              <p className="mb-4 inline-flex bg-[#f6efe1] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8f6729]">
                Planned for next phase: RAG-based AI Search
              </p>
              <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.035em] text-[var(--navy)] sm:text-[2.5rem]">
                Ask About Algeria–Europe Energy
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)]">
                Future versions of the platform will provide source-based answers from trusted government, news, and research materials.
              </p>
            </div>
            <div className="border border-[var(--line)] bg-[#f4f6f3] p-5 sm:p-7">
              <label htmlFor="ai-preview" className="mb-3 block text-xs font-bold uppercase tracking-[0.17em] text-[var(--green)]">AI Search Preview</label>
              <input
                id="ai-preview"
                disabled
                value="Ask a question about Algeria–Europe energy..."
                className="w-full border border-[var(--line)] bg-white px-4 py-4 text-sm text-slate-400 disabled:cursor-not-allowed"
                readOnly
              />
              <div className="mt-5 border-l-2 border-[var(--gold)] bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Example question</p>
                <p className="mt-3 text-sm font-medium leading-7 text-[var(--navy)]">
                  “What is the strategic importance of the Nigeria–Algeria–Europe gas pipeline?”
                </p>
              </div>
              <p className="mt-5 text-xs leading-6 text-[var(--muted)]">UI preview only. No AI query or retrieval is implemented in Phase 1 homepage scope.</p>
            </div>
          </div>
        </section>

        <section id="energy-focus" className="border-y border-[var(--line)] bg-white py-16 sm:py-20 lg:py-24">
          <div className="container-page">
            <SectionHeading eyebrow="Focus Areas" title="Energy themes covered by RamBelEnergy" align="left" />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {focusAreas.map((area) => <FocusAreaCard key={area.title} area={area} />)}
            </div>
          </div>
        </section>

        <CTASection
          title="Research, Media & Strategic Energy Collaboration"
          description="For research inquiries, institutional discussions, or strategic energy collaboration, contact RamBelEnergy."
          buttonLabel="Contact"
          buttonHref="/contact"
        />
      </main>
      <Footer items={navItems} areas={focusAreas} />
    </>
  );
}

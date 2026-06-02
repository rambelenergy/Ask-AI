import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { AskEnergyChat } from "@/components/ask-energy/AskEnergyChat";
import { T } from "@/components/language/t";

export const metadata: Metadata = {
  title: "Ask Energy",
  description: "Experimental Energy Intelligence Assistant — ask about Algeria–Europe energy relations.",
};

export default function AiAssistantPage() {
  return (
    <>
      {/* Page header */}
      <section className="section-light border-b border-[var(--line)]">
        <div className="container-page py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="breadcrumb mb-6">
            <Link href="/"><T k="common.home" /></Link>
            <ChevronRight size={14} className="text-[var(--line)]" />
            <span className="current">Ask Energy</span>
          </nav>

          <div className="mb-3 inline-flex items-center gap-2 bg-[var(--gold)]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            <Sparkles size={14} />
            Experimental Feature
          </div>
          <h1 className="heading-xl">Ask Energy</h1>
          <p className="body-lg mt-4 max-w-[680px]">
            Experimental Energy Intelligence Assistant — ask questions about Algeria–Europe energy relations, energy security, renewable energy, green hydrogen, and related strategic topics.
          </p>
        </div>
      </section>

      {/* Chat panel */}
      <section
        className="py-10 sm:py-14"
        style={{
          background: "url('/sahara-energy.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-page">
        <div className="mx-auto max-w-[680px]">
          <AskEnergyChat />
        </div>
        <div className="mx-auto mt-4 max-w-[680px] space-y-2 text-center text-[11px] leading-5 text-[var(--muted)]">
          <p>
            Experimental feature. Answers should be reviewed with trusted sources for important decisions.
          </p>
        </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="container-page pb-16 sm:pb-20">
        <div className="mx-auto max-w-[740px] rounded-xl border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[var(--navy)]">What Ask Energy does</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-[var(--green)]">✓</span>
              Provides energy intelligence answers focused on Algeria–Europe relations, energy security, solar, hydrogen, and related topics.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-[var(--green)]">✓</span>
              Uses a specialized energy-focused system prompt for relevant, analytical responses.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-[var(--green)]">✓</span>
              Maintains conversation context within the current session.
            </li>
          </ul>

          <h2 className="mt-8 text-lg font-bold text-[var(--navy)]">Current limitations</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-red-400">✗</span>
              Does not yet retrieve information from live data, platform articles, or indexed documents.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-red-400">✗</span>
              Does not perform RAG (retrieval-augmented generation) or vector search.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-red-400">✗</span>
              Does not provide source citations or real-time data.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-red-400">✗</span>
              Answers should be reviewed against trusted sources for important decisions.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

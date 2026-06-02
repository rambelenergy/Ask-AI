import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export function SearchPreviewBox() {
  return (
    <section className="container-page py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">AI Search Preview</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--navy)]">
            A concept interface for future source-based answers.
          </h2>
          <p className="mt-6 text-[17px] leading-8 text-[var(--muted)]">
            This preview demonstrates how users may later ask questions about Algeria–Europe energy relations,
            pipeline strategy, sustainability cooperation, and Mediterranean energy security.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-[var(--line)] bg-white p-8 shadow-sm">
            <div className="mb-5 inline-flex rounded-sm bg-[#f4efe6] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#94651f]">
              Demo concept &mdash; full RAG workflow planned for next phase
            </div>

            <div className="flex min-h-16 items-center gap-4 border border-[var(--line)] bg-[#f8faf9] px-5 text-slate-500">
              <Search size={21} className="text-[var(--green)]" />
              <span>Ask a question about Algeria&ndash;Europe energy...</span>
            </div>

            <div className="mt-6 border-l-4 border-[var(--green)] bg-[#f6f8f7] p-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Example question</div>
              <p className="text-[18px] font-semibold leading-7 text-[var(--navy)]">
                What is the strategic importance of the Nigeria&ndash;Algeria&ndash;Europe gas pipeline?
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/ai-assistant"
                className="inline-flex items-center gap-2 rounded border border-[var(--green)] bg-[var(--green)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e4b40]"
              >
                View AI Concept <ArrowRight size={16} />
              </Link>
              <span className="text-sm font-medium text-slate-500">Preview state only</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

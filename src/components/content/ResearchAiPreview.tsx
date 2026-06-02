import Link from "next/link";
import { ArrowRight, Brain, Database } from "lucide-react";

const items = [
  "Indexed publications",
  "Government materials",
  "News sources",
  "Source-based answers",
];

export function ResearchAiPreview() {
  return (
    <section className="bg-[var(--navy)] py-20 text-white">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <div className="mb-5 inline-flex rounded-sm bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
            Planned for next phase
          </div>
          <h2 className="text-4xl font-bold tracking-tight">Future AI Knowledge Base</h2>
          <p className="mt-6 max-w-[760px] text-[17px] leading-8 text-slate-300">
            Future phases will allow users to ask questions across indexed research, government materials, news sources,
            and publications using a RAG-based AI workflow.
          </p>
          <Link
            href="/ai-assistant"
            className="mt-8 inline-flex items-center gap-2 rounded-sm border border-[var(--green)] bg-[var(--green)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e4b40]"
          >
            View AI Preview <ArrowRight size={16} />
          </Link>
        </div>
        <div className="lg:col-span-5">
          <div className="border border-white/10 bg-white/[0.04] p-7">
            <div className="mb-5 flex items-center gap-3 text-[var(--gold)]">
              <Brain size={24} />
              <span className="text-sm font-bold uppercase tracking-[0.14em]">RAG workflow concept</span>
            </div>
            <div className="grid gap-3">
              {items.map((item) => (
                <div key={item} className="flex items-center gap-3 border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
                  <Database size={16} className="text-[var(--gold)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

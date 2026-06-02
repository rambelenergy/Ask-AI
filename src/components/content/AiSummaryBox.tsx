import { Brain, ArrowRight } from "lucide-react";

export function AiSummaryBox() {
  return (
    <aside className="border border-[var(--line)] bg-white p-6">
      <div className="mb-4 inline-flex rounded-sm bg-[#f4efe6] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#94651f]">
        Phase 1 AI Feature
      </div>
      <div className="mb-4 flex items-center gap-3">
        <Brain size={22} className="text-[var(--green)]" />
        <h3 className="text-xl font-bold text-[var(--navy)]">AI Summary</h3>
      </div>
      <p className="text-sm leading-7 text-slate-600">
        AI-generated summary can support editorial work, but final publication should be reviewed by the author.
      </p>
      <button
        disabled
        className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-sm border border-[var(--green)] bg-[var(--green)] px-4 py-3 text-sm font-semibold text-white opacity-60"
      >
        Generate Summary <ArrowRight size={15} />
      </button>
    </aside>
  );
}

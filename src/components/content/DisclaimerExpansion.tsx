import { AlertTriangle, CheckCircle2 } from "lucide-react";

const futureCapabilities = [
  "Full RAG workflow",
  "Vector database",
  "Document indexing",
  "Multilingual AI processing",
  "Source-based AI answers",
  "AI-generated research summaries",
  "Larger Algeria&ndash;Europe energy knowledge base",
];

export function DisclaimerExpansion() {
  return (
    <section className="border-y border-[var(--line)] bg-white py-20">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="border-l-4 border-[var(--gold)] bg-[#f8faf9] p-7">
            <div className="mb-4 flex items-center gap-3 text-[#94651f]">
              <AlertTriangle size={22} />
              <h3 className="text-2xl font-bold text-[var(--navy)]">Phase 1 Limitation</h3>
            </div>
            <p className="text-[16px] leading-8 text-[var(--muted)]">
              In the first lean MVP, this feature will be presented as an AI preview. The full RAG-based AI search,
              vector database, document indexing, multilingual AI processing, and source-based answers are planned for
              the next phase.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="mb-7 text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Future expansion</div>
          <h2 className="text-4xl font-bold tracking-tight text-[var(--navy)]">Future AI Capabilities</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {futureCapabilities.map((item) => (
              <div key={item} className="flex items-center gap-4 border border-[var(--line)] bg-[#fbfcfb] p-4">
                <CheckCircle2 className="shrink-0 text-[var(--green)]" size={20} />
                <span className="text-sm font-semibold text-slate-700" dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";

const workflow = [
  "Government / News / Research Sources",
  "Content Ingestion",
  "Text Extraction",
  "Chunking",
  "Embedding",
  "Vector Database",
  "User Question",
  "Similarity Search",
  "Relevant Context",
  "Source-Based AI Answer",
];

export function WorkflowDiagram() {
  return (
    <section className="container-page py-20">
      <div className="mb-10 flex items-end justify-between border-b border-[var(--line)] pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Future AI/RAG Workflow</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--navy)]">From selected sources to source-based answers</h2>
        </div>
        <div className="hidden text-sm text-[var(--muted)] md:block">Planned technical direction</div>
      </div>

      <div className="border border-[var(--line)] bg-white p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {workflow.map((item, index) => (
            <div key={item} className="relative border border-[var(--line)] bg-[#f8faf9] p-5">
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="min-h-[54px] text-[15px] font-semibold leading-6 text-[var(--navy)]">{item}</div>
              {index < workflow.length - 1 && (
                <div className="absolute -right-4 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--green)] lg:flex">
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

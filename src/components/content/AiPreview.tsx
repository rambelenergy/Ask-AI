import { Brain, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function AiPreview() {
  return (
    <section className="container-page py-20">
      <div className="grid overflow-hidden border border-[var(--line)] bg-white lg:grid-cols-12">
        <div className="border-b border-[var(--line)] p-10 lg:col-span-5 lg:border-b-0 lg:border-r">
          <div className="mb-4 inline-flex rounded-sm bg-[#f4efe6] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#94651f]">
            Planned for next phase
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-[var(--navy)]">Ask about Algeria–Europe Energy (Planned feature)</h2>
          <p className="mt-5 text-[17px] leading-8 text-[var(--muted)]">
            Coming next: AI-powered search drawing on selected government, news, and research materials.
          </p>
        </div>
        <div className="bg-[#f6f8f7] p-10 lg:col-span-7">
          <div className="mb-6 flex items-center gap-3 text-sm font-semibold text-[var(--green)]">
            <Brain size={20} /> Future knowledge base preview
          </div>
          <div className="flex h-16 items-center gap-4 border border-[var(--line)] bg-white px-5 text-slate-400">
            <Search size={20} />
            <span>Ask a question about Algeria–Europe energy...</span>
          </div>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Future capabilities
            </div>
            <div className="mt-2 grid gap-4 md:grid-cols-3">
              {["Curated sources (planned)", "Research archive (planned)", "Analytical search (planned)"].map((item) => (
                <div key={item} className="border border-[var(--line)] bg-white p-4 text-sm font-semibold text-slate-700">
                  {item}
                </div>
              ))}
          </div>
          <ButtonLink href="/ai-assistant" variant="secondary" className="mt-7">View AI Assistant</ButtonLink>
        </div>
      </div>
    </section>
  );
}

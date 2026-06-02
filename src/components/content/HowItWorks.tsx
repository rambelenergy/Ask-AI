import { BookOpen, FileText, Search, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    title: "Curated Sources",
    text: "Selected government, news, research, and policy materials.",
  },
  {
    icon: FileText,
    title: "Document Processing",
    text: "Sources will be extracted, structured, and prepared for AI analysis.",
  },
  {
    icon: Search,
    title: "Source-Based Search",
    text: "The system will retrieve relevant context before generating an answer.",
  },
  {
    icon: ShieldCheck,
    title: "AI Answer with References",
    text: "Answers will be based on selected materials and include source references.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-[var(--line)] bg-white py-20">
      <div className="container-page">
        <div className="mb-10 max-w-[760px]">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">How it will work</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--navy)]">
            A practical AI workflow for research and policy context.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="border border-[var(--line)] bg-[#fbfcfb] p-7">
              <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[var(--line)] bg-white text-[var(--green)]">
                <Icon size={24} />
              </div>
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                Step {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-xl font-bold text-[var(--navy)]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

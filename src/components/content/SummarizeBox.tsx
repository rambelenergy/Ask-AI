import { FileText } from "lucide-react";
import { T } from "@/components/language/t";

interface SummarizeBoxProps {
  summarize: string | null;
}

export function SummarizeBox({ summarize }: SummarizeBoxProps) {
  if (!summarize) {
    return null;
  }

  return (
    <aside className="border border-[var(--line)] bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <FileText size={22} className="text-[var(--green)]" />
        <h3 className="text-xl font-bold text-[var(--navy)]"><T k="article.summarize.title" /></h3>
      </div>
      <p className="text-sm leading-7 text-slate-600 whitespace-pre-wrap">{summarize}</p>
    </aside>
  );
}

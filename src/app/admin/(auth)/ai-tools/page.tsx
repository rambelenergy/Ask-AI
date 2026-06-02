import { AiSummarizerPanel } from "@/components/admin/AiSummarizerPanel";
import { Brain, AlertTriangle } from "lucide-react";

export default function AiToolsPage() {
  return (
    <div>
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Brain size={18} className="mt-0.5 shrink-0 text-[var(--green)]" />
        <div>
          <p className="text-[13px] font-semibold text-[#07152a]">AI Content Tools</p>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Summarize articles and content using AI. Output should be reviewed before publishing.
          </p>
        </div>
      </div>

      <AiSummarizerPanel />
    </div>
  );
}

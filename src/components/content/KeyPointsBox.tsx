import { CheckCircle2 } from "lucide-react";

const keyPoints = [
  "Algeria may play a central role in Europe&rsquo;s energy diversification",
  "The Nigeria&ndash;Algeria&ndash;Europe route connects African supply with European demand",
  "Italy and Spain are key strategic destinations",
  "Political stability and infrastructure financing remain important challenges",
];

export function KeyPointsBox() {
  return (
    <aside className="border border-[var(--line)] bg-white p-6">
      <h3 className="text-xl font-bold text-[var(--navy)]">Key Points</h3>
      <div className="mt-5 space-y-4">
        {keyPoints.map((point) => (
          <div key={point} className="flex gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
            <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--green)]" />
            <p className="text-sm leading-6 text-slate-700" dangerouslySetInnerHTML={{ __html: point }} />
          </div>
        ))}
      </div>
    </aside>
  );
}

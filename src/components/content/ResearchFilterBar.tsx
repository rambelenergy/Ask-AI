"use client";

import { useState } from "react";
import { Search, Filter, FileText } from "lucide-react";

type ResearchFilterBarProps = {
  categories: string[];
  types: string[];
};

export function ResearchFilterBar({ categories, types }: ResearchFilterBarProps) {
  const [active, setActive] = useState(0);

  const filterSets = [
    { icon: Search, label: "Search publications..." },
    { icon: Filter, label: "All Categories" },
    { icon: FileText, label: types.length > 0 ? types.join(" / ") : "Policy Brief / Research Note / Analysis / Report" },
  ];

  return (
    <section className="border-y border-[var(--line)] bg-white">
      <div className="container-page flex items-center gap-3 overflow-x-auto py-5">
        {filterSets.map(({ icon: Icon, label }, index) => (
          <button
            key={label}
            onClick={() => setActive(index)}
            className={`flex h-12 items-center gap-3 border border-[var(--line)] px-4 text-sm whitespace-nowrap transition ${
              index === active
                ? "border-[var(--green)] bg-[#f8faf9] text-[var(--green)]"
                : index === 0
                ? "bg-[#f8faf9] text-slate-500"
                : "bg-white text-slate-700 hover:border-[var(--green)] hover:text-[var(--green)]"
            }`}
          >
            <Icon size={17} className="text-[var(--green)]" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

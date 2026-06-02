"use client";

import { useState } from "react";

type FilterBarProps = {
  categories: string[];
};

export function FilterBar({ categories }: FilterBarProps) {
  const allCategories = ["All", ...categories];
  const [active, setActive] = useState(allCategories[0]);

  return (
    <section className="border-y border-[var(--line)] bg-white">
      <div className="container-page flex items-center gap-3 overflow-x-auto py-5">
        {allCategories.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`whitespace-nowrap rounded-sm border px-4 py-2 text-sm font-semibold transition ${
              filter === active
                ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                : "border-[var(--line)] bg-white text-slate-700 hover:border-[var(--green)] hover:text-[var(--green)]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}

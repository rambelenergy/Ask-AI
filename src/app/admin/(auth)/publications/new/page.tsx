import { PublicationForm } from "@/components/admin/PublicationForm";
import { createPublication } from "@/lib/actions/publications";
import { getPublicationCategories, getPublicationRegions } from "@/lib/publications";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewPublicationPage() {
  const [categories, regions] = await Promise.all([
    getPublicationCategories(),
    getPublicationRegions(),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-[13px] text-slate-500">
        <Link href="/admin/publications" className="flex items-center gap-1 transition hover:text-[var(--green)]">
          <ArrowLeft size={14} /> Publications
        </Link>
        <span>/</span>
        <span className="font-medium text-[#07152a]">New Publication</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--green-soft)] text-[var(--green)] shrink-0">
            <BookOpen size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-[#07152a]">New Publication</h1>
            <p className="text-[12px] text-slate-500">Add a research note, policy brief, or report</p>
          </div>
        </div>

        <PublicationForm
          action={createPublication}
          existingCategories={categories}
          existingRegions={regions}
        />
      </div>
    </div>
  );
}

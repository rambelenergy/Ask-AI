import { notFound } from "next/navigation";
import { PublicationForm } from "@/components/admin/PublicationForm";
import { updatePublication } from "@/lib/actions/publications";
import { getPublicationById, getPublicationCategories, getPublicationRegions } from "@/lib/publications";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPublicationPage({ params }: Props) {
  const { id } = await params;
  const publication = await getPublicationById(id);

  if (!publication) {
    notFound();
  }

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
        <span className="font-medium text-[#07152a] line-clamp-1 max-w-[300px]">{publication.title}</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--green-soft)] text-[var(--green)] shrink-0">
            <BookOpen size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-[#07152a]">Edit Publication</h1>
            <p className="text-[12px] text-slate-500 truncate">{publication.title}</p>
          </div>
        </div>

        <PublicationForm
          action={updatePublication}
          existingCategories={categories}
          existingRegions={regions}
          initialData={{
            id: publication.id,
            title: publication.title,
            slug: publication.slug,
            excerpt: publication.excerpt || "",
            body_html: publication.body_html || "",
            cover_image_url: publication.cover_image_url || "",
            pub_type: publication.pub_type || "",
            category: publication.category || "",
            region: publication.region || "",
            author: publication.author || "",
            external_url: publication.external_url || "",
            file_url: publication.file_url || "",
            status: publication.status,
            summarize: publication.summarize || "",
          }}
        />
      </div>
    </div>
  );
}

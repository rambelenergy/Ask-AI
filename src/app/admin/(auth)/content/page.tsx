import { createClient } from "@/lib/supabase/server";
import type { SiteContentBlock } from "@/lib/site-content";
import { SiteContentBlockForm } from "@/components/admin/SiteContentBlockForm";
import { updateSiteContent } from "@/lib/actions/site-content";
import { Globe, Info } from "lucide-react";

export default async function ContentPage() {
  const supabase = await createClient();
  const { data: allBlocks } = await supabase
    .from("site_content")
    .select("*")
    .order("block_key");

  const blocks = (allBlocks || []) as SiteContentBlock[];

  return (
    <div>
      {/* Info banner */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Info size={18} className="mt-0.5 shrink-0 text-[var(--green)]" />
        <div>
          <p className="text-[13px] font-semibold text-[#07152a]">Editable content blocks</p>
          <p className="mt-0.5 text-[12px] text-slate-500">Changes to these blocks appear immediately on the public site.</p>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-14 text-center shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
            <Globe size={24} className="text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-[#07152a]">No content blocks found</p>
          <p className="mt-1 text-[13px] text-slate-500">Run seed migrations to populate the site_content table.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2">
          {blocks.map((block) => (
            <div key={block.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-bold text-[#07152a]">{block.label}</h3>
                  <code className="mt-1 inline-block rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-mono text-slate-500">
                    {block.block_key}
                  </code>
                </div>
                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {Array.isArray(block.content_json) ? "Array" : "Object"}
                </span>
              </div>
              <SiteContentBlockForm
                blockKey={block.block_key}
                label={block.label}
                currentContent={block.content_json || {}}
                action={updateSiteContent}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

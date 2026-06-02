import { getAllAboutSections } from "@/lib/about-sections";
import type { AboutSection } from "@/lib/about-sections";
import { AboutSectionForm } from "@/components/admin/AboutSectionForm";
import { updateAboutSection } from "@/lib/actions/about-sections";
import { User, Info } from "lucide-react";

export default async function AboutPage() {
  const sections = await getAllAboutSections();

  return (
    <div>
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Info size={18} className="mt-0.5 shrink-0 text-[var(--green)]" />
        <div>
          <p className="text-[13px] font-semibold text-[#07152a]">About page sections</p>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Edit profile, mission, values, and future vision. Changes appear on the public about page.
          </p>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-14 text-center shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
            <User size={24} className="text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-[#07152a]">No about sections found</p>
          <p className="mt-1 text-[13px] text-slate-500">Run seed migrations to populate the about_sections table.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {sections.map((section: AboutSection) => (
            <div key={section.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-[#07152a]">{section.label}</h3>
                <code className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-mono text-slate-500">
                  {section.section_key}
                </code>
              </div>
              <AboutSectionForm
                sectionKey={section.section_key}
                label={section.label}
                currentContent={section.content_json || {}}
                action={updateAboutSection}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

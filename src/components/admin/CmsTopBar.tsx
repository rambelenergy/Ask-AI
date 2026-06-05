"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Plus, Bell, Settings } from "lucide-react";

function getNewButton(pathname: string): { label: string; href: string } | null {
  if (pathname.startsWith("/admin/articles")) {
    return { label: "New Article", href: "/admin/articles/new" };
  }
  if (pathname.startsWith("/admin/publications")) {
    return { label: "New Publication", href: "/admin/publications/new" };
  }
  return null;
}

export function CmsTopBar() {
  const pathname = usePathname();
  const newButton = getNewButton(pathname);

  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname.startsWith("/admin/articles")) return "Articles";
    if (pathname.startsWith("/admin/publications")) return "Publications";
    if (pathname === "/admin/content") return "Site Content";
    if (pathname === "/admin/about") return "About";
    if (pathname === "/admin/ai-tools") return "AI Tools";
    return "Content Management";
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-md">
      <div className="flex h-[68px] items-center justify-between pl-14 pr-4 md:px-8">
        <div className="flex items-center gap-2 md:gap-4">
          <h1 className="text-base font-bold tracking-tight text-[var(--navy)] md:text-xl">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search */}
          <div className="hidden items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted-soft)] md:flex">
            <Search size={15} />
            <span className="text-[13px]">Search content...</span>
            <kbd className="ml-2 rounded border border-[var(--line)] bg-[var(--paper)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--muted-soft)]">⌘K</kbd>
          </div>

          {newButton && (
            <Link
              href={newButton.href}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--green)] px-3 text-[12px] font-semibold text-white transition hover:bg-[#0e4b40] hover:shadow-md md:gap-2 md:px-4 md:text-[13px]"
            >
              <Plus size={15} className="md:size-4" />
              <span className="hidden sm:inline">{newButton.label}</span>
              <span className="sm:hidden">New</span>
            </Link>
          )}

          <div className="flex items-center gap-1.5 border-l border-[var(--line)] pl-2 md:gap-2 md:pl-4">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-soft)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)]">
              <Bell size={16} className="md:size-[17px]" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-soft)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)]">
              <Settings size={16} className="md:size-[17px]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

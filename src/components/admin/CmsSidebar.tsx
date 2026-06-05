"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Globe,
  Brain,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const sidebarItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Articles", href: "/admin/articles", icon: FileText },
  { label: "Research & Publications", href: "/admin/publications", icon: BookOpen },
  { label: "Site Content", href: "/admin/content", icon: Globe },
  { label: "About", href: "/admin/about", icon: User },
  { label: "AI Tools", href: "/admin/ai-tools", icon: Brain },
];

export function CmsSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a1628] text-white shadow-lg md:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-[#0a1628] text-white transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/8 px-6 py-6">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="shrink-0 transition-transform hover:scale-105"
            aria-label="Back to homepage"
          >
            <img
              src="/logo.png"
              alt="RamBelEnergy"
              className="h-9 w-auto bg-[#eef2ef] rounded-sm p-1"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">Content Management</div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Content</p>
        {sidebarItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${
                active
                  ? "bg-[var(--green)]/15 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <Icon size={17} className={active ? "text-[var(--green)]" : "text-slate-500"} />
              <span>{label}</span>
              {active && <ChevronRight size={14} className="ml-auto text-[var(--green)]" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/8 px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
        >
          <LogOut size={17} className="text-slate-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}

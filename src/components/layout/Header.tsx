"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, LogOut, LayoutDashboard, ChevronDown, Menu, X } from "lucide-react";
import { navItems } from "@/data/homepage";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { useLanguage } from "@/components/language/language-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll state
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser({ email: session.user.email ?? "" });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser({ email: session.user.email ?? "" });
      else setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdown(false);
      }
    }
    if (userDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdown]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserDropdown(false);
    window.location.href = "/";
  }

  const isHome = pathname === "/";

  // Map nav item href to translation key
  const navKeyMap: Record<string, string> = {
    "/": "nav.home",
    "/ai-assistant": "nav.askEnergy",
    "/analysis": "nav.articles",
    "/global-map": "nav.globalMap",
    "/about": "nav.about",
  };

  function isNavActive(href: string): boolean {
    // Hash links only highlight on homepage
    if (href.startsWith("/#")) return pathname === "/";
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-400 ${
        scrolled || !isHome
          ? "border-b border-[var(--line)] bg-[var(--paper)] shadow-[0_1px_3px_rgba(7,26,46,0.04)]"
          : "border-b border-transparent bg-[var(--paper)]"
      }`}
    >
      {/* Top utility bar — IFRI-inspired subtle top strip */}
      <div className="hidden border-b border-[var(--line-soft)] bg-[var(--surface)] lg:block">
        <div className="container-page flex h-9 items-center justify-between text-[11px] font-medium tracking-[0.03em] text-[var(--muted-soft)]">
          <span>{t("nav.topTagline")}</span>
          <div className="flex items-center gap-4">
            {/* <ThemeToggle /> */}
            <Link href="/analysis" className="transition-colors hover:text-[var(--green)]">{t("nav.analysis")}</Link>
            <span className="text-[var(--line)]">|</span>
            <Link href="/research" className="transition-colors hover:text-[var(--green)]">{t("nav.research")}</Link>
            <span className="text-[var(--line)]">|</span>
            <Link href="/contact" className="transition-colors hover:text-[var(--green)]">{t("nav.contact")}</Link>
            <span className="text-[var(--line)]">|</span>
            {/* <LanguageSwitcher /> */}
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          aria-label="RamBelEnergy — Home"
          className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-85"
        >
          <img
            src="/logo.png"
            alt="RamBelEnergy"
            className="site-logo h-10 w-auto transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <span className="hidden text-lg font-bold tracking-[-0.03em] text-[var(--navy)] sm:block">
            RamBelEnergy
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label={t("nav.menu")} className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const active = isNavActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                data-active={active}
                className="nav-link"
              >
                {t((navKeyMap[item.href] || item.label.toLowerCase()) as Parameters<typeof t>[0])}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Search */}
          <SearchOverlay />

          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3.5 py-1.5 text-sm transition-all hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--navy)] to-[#1a3a52] text-xs font-bold text-white">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[110px] truncate text-[12px] text-[var(--muted)]">
                  {user.email}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${userDropdown ? "rotate-180" : ""}`} />
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-[var(--line)] bg-white py-1.5 shadow-lg shadow-slate-200/60">
                  <Link
                    href="/admin"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[var(--navy)] transition-colors hover:bg-[var(--surface)]"
                  >
                    <LayoutDashboard size={15} className="text-slate-400" />
                    {t("nav.dashboard")}
                  </Link>
                  <div className="mx-3 my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={15} />
                    {t("nav.signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--navy)] px-5 py-2 text-[13px] font-semibold text-[var(--navy)] transition-all hover:bg-[var(--navy)] hover:text-white hover:shadow-md"
            >
              <User size={14} />
              {t("nav.login")}
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--navy)] transition-colors hover:bg-slate-50 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in panel */}
          <nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            className="fixed inset-y-0 right-0 z-[70] w-[300px] max-w-[85vw] overflow-y-auto border-l border-[var(--line)] bg-white shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <span className="text-sm font-bold text-[var(--navy)]">{t("nav.menu")}</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-slate-50"
                aria-label={t("nav.menu")}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col p-4">
              {navItems.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3.5 text-[15px] font-medium transition-colors ${
                      active
                        ? "bg-[var(--green-soft)] text-[var(--green)]"
                        : "text-[var(--navy)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    {t((navKeyMap[item.href] || item.label.toLowerCase()) as Parameters<typeof t>[0])}
                  </Link>
                );
              })}

              <div className="my-4 border-t border-[var(--line-soft)]" />

              {/* Theme & language — mobile */}
              <div className="mb-4 flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                  Theme
                </span>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              </div>

              <div className="border-t border-[var(--line-soft)]" />

              {user ? (
                <div className="space-y-2">
                  <div className="mb-3 rounded-lg bg-[var(--surface)] px-4 py-2.5 text-[13px] text-[var(--muted)]">
                    {t("nav.signedInAs")} <span className="font-semibold text-[var(--navy)]">{user.email}</span>
                  </div>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg border border-[var(--line)] px-4 py-3 text-[14px] font-semibold text-[var(--navy)] transition-colors hover:bg-[var(--surface)]"
                  >
                    <LayoutDashboard size={16} />
                    {t("nav.dashboard")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-[14px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    {t("nav.signOut")}
                  </button>
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[var(--navy)] px-4 py-3 text-[14px] font-semibold text-[var(--navy)] transition-all hover:bg-[var(--navy)] hover:text-white"
                >
                  <User size={16} />
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

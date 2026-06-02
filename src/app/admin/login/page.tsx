"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--background)] to-[#f0f1ee] px-4">
      <div className="w-full max-w-[420px]">
        {/* Card */}
        <div className="rounded-2xl border border-[var(--line)] bg-white p-8 shadow-[0_8px_32px_rgba(8,26,44,0.06)]">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--navy)] to-[#1a3a52]">
                <span className="text-lg font-bold text-white">R</span>
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--navy)]">
              Admin Login
            </h1>
            <p className="mt-1.5 text-[13px] text-[var(--muted)]">
              Sign in to manage your content
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Email
              </label>
              <input
                id="email" type="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:border-[var(--green)] focus:outline-none"
                placeholder="admin@rambelenergy.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Password
              </label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? "text" : "password"} required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-[14px] text-slate-700 placeholder:text-slate-400 focus:border-[var(--green)] focus:outline-none"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--green)] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#0e4b40] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-[11px] text-slate-400">
          Restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
}

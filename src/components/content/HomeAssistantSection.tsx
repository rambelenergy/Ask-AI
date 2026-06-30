"use client";

import { AskEnergyChat } from "@/components/ask-energy/AskEnergyChat";

export function HomeAssistantSection() {
  return (
    <section
      className="border-y border-white/5 py-10 sm:py-20 lg:py-16"
      style={{
        background: "url('/sahara-energy.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-page">
        {/* Section heading */}
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">See It In Action</p>
          <h2 className="text-2xl font-bold tracking-[-0.035em] text-[var(--navy)] sm:text-3xl">
            Ask Energy — AI-Powered Insights
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14 lg:items-start">
          {/* Left: Video in phone mockup */}
          <div className="mx-auto w-full max-w-[260px] lg:max-w-none shrink-0">
            <div className="relative overflow-hidden rounded-[2rem] border-2 border-white/15 bg-black shadow-2xl shadow-black/40">
              <video
                src="/demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="block w-full"
              />
            </div>
            <p className="mt-3 text-center text-[12px] leading-5 text-[var(--muted)]">
              Watch how Ask Energy works
            </p>
          </div>

          {/* Right: Chat */}
          <div className="w-full min-w-0">
            <AskEnergyChat />
          </div>
        </div>

        {/* Disclaimers */}
        <div className="mx-auto mt-6 max-w-[680px] space-y-2 text-center text-[11px] leading-5 text-[var(--muted)]">
          <p>
            Experimental feature. Answers should be reviewed with trusted sources for important decisions.
          </p>
        </div>
      </div>
    </section>
  );
}

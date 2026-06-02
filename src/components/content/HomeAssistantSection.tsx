"use client";

import { Sparkles } from "lucide-react";
import { AskEnergyChat } from "@/components/ask-energy/AskEnergyChat";

export function HomeAssistantSection() {
  return (
    <section
      className="border-y border-white/5 py-10 sm:py-20 lg:py-10"
      style={{
        background: "url('/sahara-energy.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-page">
        {/* Chat interface */}
        <div className="mx-auto max-w-[680px]">
          <AskEnergyChat />
        </div>

        {/* Disclaimers */}
        <div className="mx-auto mt-4 max-w-[680px] space-y-2 text-center text-[11px] leading-5 text-[var(--muted)]">
          <p>
            Experimental feature. Answers should be reviewed with trusted sources for important decisions.
          </p>
        </div>
      </div>
    </section>
  );
}

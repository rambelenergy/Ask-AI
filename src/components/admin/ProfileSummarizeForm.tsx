"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";

type ProfileSummarizeFormProps = {
  currentSummarize: string;
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#0b5f4d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#094c3d] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export function ProfileSummarizeForm({
  currentSummarize,
  action,
}: ProfileSummarizeFormProps) {
  const [state, formAction] = useActionState(action, { success: false });
  const [summarize, setSummarize] = useState(currentSummarize);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="summarize" value={summarize} />

      <div className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        About Summarize (Profile Section)
      </div>

      <textarea
        value={summarize}
        onChange={(e) => setSummarize(e.target.value)}
        rows={6}
        className="w-full border border-slate-200 bg-[#f8faf9] px-4 py-3 text-sm leading-relaxed text-slate-700 focus:border-[#0b5f4d] focus:outline-none"
      />

      {state.success && (
        <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
          Saved successfully.
        </div>
      )}

      {state.error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {state.error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton />
      </div>
    </form>
  );
}

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-4 py-3">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="ask-energy-chip rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[11px] sm:text-[12px] text-[var(--muted)] transition-all hover:border-[var(--green)] hover:text-[var(--green)] hover:shadow-sm active:scale-[0.97]"
        >
          <span className="font-bold text-[var(--gold)]">EXP:</span> {q.length > 60 ? q.slice(0, 60) + "…" : q}
        </button>
      ))}
    </div>
  );
}

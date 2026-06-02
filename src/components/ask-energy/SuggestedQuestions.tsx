interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-5 py-3">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="rounded-full border border-[var(--line)] bg-white px-3.5 py-1.5 text-[12px] text-[var(--muted)] transition-all hover:border-[var(--green)] hover:text-[var(--green)] hover:shadow-sm"
        >
          <span className="font-bold text-[var(--gold)]">EXP:</span> {q.length > 70 ? q.slice(0, 70) + "…" : q}
        </button>
      ))}
    </div>
  );
}

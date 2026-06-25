import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { calculateQuizScore, passThreshold } from "@/react-app/training/trainingContent";
import type { TrainingModule } from "@/react-app/training/trainingTypes";

export function QuizCard({
  module,
  onComplete,
}: {
  module: TrainingModule;
  onComplete: (score: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(() => calculateQuizScore(module, answers), [answers, module]);
  const passed = score >= passThreshold;

  if (module.quiz.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#8B5CF6]/18 bg-[#0b0910] p-5 text-sm text-[#A89CC8]">
        Quiz content for this module is not published yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Quick quiz</h3>
        <p className="mt-1 text-sm leading-6 text-[#A89CC8]">Pass mark is {passThreshold}%. Feedback appears after submission.</p>
      </div>

      {module.quiz.map((question, index) => {
        const selected = answers[question.id];
        const correct = selected === question.correctOptionId;
        return (
          <div key={question.id} className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0b0910] p-4">
            <p className="text-sm font-semibold text-white">
              {index + 1}. {question.question}
            </p>
            <div className="mt-3 grid gap-2">
              {question.options.map((option) => {
                const active = selected === option.id;
                const showCorrect = submitted && option.id === question.correctOptionId;
                const showWrong = submitted && active && !correct;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                    className="flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition disabled:cursor-default"
                    style={{
                      borderColor: showCorrect
                        ? "rgba(52,211,153,0.45)"
                        : showWrong
                          ? "rgba(251,113,133,0.45)"
                          : active
                            ? "rgba(196,181,253,0.35)"
                            : "rgba(139,92,246,0.12)",
                      backgroundColor: showCorrect
                        ? "rgba(16,185,129,0.10)"
                        : showWrong
                          ? "rgba(244,63,94,0.10)"
                          : active
                            ? "rgba(139,92,246,0.16)"
                            : "#09070d",
                      color: "#E9D5FF",
                    }}
                  >
                    <span>{option.label}</span>
                    {showCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-300" />}
                    {showWrong && <XCircle className="h-4 w-4 text-rose-300" />}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-3 text-sm leading-6 text-[#A89CC8]">
                {question.explanation}
              </p>
            )}
          </div>
        );
      })}

      {submitted ? (
        <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#8778AD]">Quiz result</p>
              <p className="mt-2 text-3xl font-semibold text-white">{score}%</p>
              <p className="mt-1 text-sm text-[#A89CC8]">
                {passed ? "Passed. This module can be marked complete." : "Review the lesson and retry when ready."}
              </p>
            </div>
            <div className="flex gap-2">
              {!passed && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#8B5CF6]/16 bg-[#0b0910] text-[#E9D5FF]"
                  onClick={() => {
                    setAnswers({});
                    setSubmitted(false);
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              )}
              <Button type="button" className="bg-[#6D28D9] text-white hover:bg-[#8B5CF6]" onClick={() => onComplete(score)}>
                Save result
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          disabled={Object.keys(answers).length < module.quiz.length}
          className="bg-[#6D28D9] text-white hover:bg-[#8B5CF6] disabled:opacity-50"
          onClick={() => setSubmitted(true)}
        >
          Submit quiz
        </Button>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ListChecks, ShieldCheck } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Progress } from "@/react-app/components/ui/progress";
import { QuizCard } from "./QuizCard";
import { passThreshold } from "@/react-app/training/trainingContent";
import type { TrainingModule, TrainingProgress } from "@/react-app/training/trainingTypes";

export function LessonPlayer({
  module,
  progress,
  saving,
  onSave,
  onBack,
}: {
  module: TrainingModule;
  progress?: TrainingProgress;
  saving?: boolean;
  onSave: (input: { lessonProgress: Record<string, boolean>; quizScore: number | null; status: string }) => Promise<void>;
  onBack: () => void;
}) {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>(progress?.lessonProgress || {});
  const [quizScore, setQuizScore] = useState<number | null>(progress?.quizScore ?? null);
  const [view, setView] = useState<"lesson" | "quiz" | "complete">("lesson");

  const lessons = module.lessons;
  const currentLesson = lessons[lessonIndex];
  const completedLessons = lessons.filter((lesson) => lessonProgress[lesson.id]).length;
  const percent = lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0;
  const canComplete = percent === 100 && quizScore !== null && quizScore >= passThreshold;
  const hasPublishedLessons = lessons.length > 0;

  const lessonNav = useMemo(
    () =>
      lessons.map((lesson, index) => (
        <button
          key={lesson.id}
          type="button"
          onClick={() => {
            setLessonIndex(index);
            setView("lesson");
          }}
          className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
            index === lessonIndex ? "border-[#C4B5FD]/28 bg-[#8B5CF6]/16 text-white" : "border-[#8B5CF6]/12 bg-[#0b0910] text-[#A89CC8] hover:text-white"
          }`}
        >
          <span>{lesson.title}</span>
          {lessonProgress[lesson.id] && <CheckCircle2 className="h-4 w-4 text-emerald-300" />}
        </button>
      )),
    [lessonIndex, lessonProgress, lessons],
  );

  if (!hasPublishedLessons) {
    return (
      <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-6">
        <Button variant="ghost" className="mb-4 text-[#C4B5FD]" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Academy
        </Button>
        <h2 className="text-2xl font-semibold text-white">{module.title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A89CC8]">
          This module is in the v1 library and can be assigned for planning, but lesson content is not published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_280px]">
      <aside className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-4">
        <Button variant="ghost" className="mb-4 px-0 text-[#C4B5FD]" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Academy
        </Button>
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#8778AD]">Module</p>
        <h2 className="mt-2 text-lg font-semibold text-white">{module.title}</h2>
        <div className="mt-4 space-y-2">{lessonNav}</div>
      </aside>

      <main className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-5">
        {view === "quiz" ? (
          <QuizCard
            module={module}
            onComplete={async (score) => {
              setQuizScore(score);
              const status = score >= passThreshold && percent === 100 ? "completed" : "in_progress";
              await onSave({ lessonProgress, quizScore: score, status });
              if (status === "completed") setView("complete");
            }}
          />
        ) : view === "complete" ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/24 bg-emerald-400/10 text-emerald-300">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-white">Module complete</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#A89CC8]">
              Your result has been saved. Training supports awareness and readiness; it does not replace legal advice, formal POPIA compliance review, or incident response obligations.
            </p>
            <Button className="mt-6 bg-[#6D28D9] text-white hover:bg-[#8B5CF6]" onClick={onBack}>
              Return to Academy
            </Button>
          </div>
        ) : currentLesson ? (
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8778AD]">Lesson {lessonIndex + 1} of {lessons.length}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{currentLesson.title}</h2>
            <div className="mt-5 space-y-5">
              {currentLesson.contentBlocks.map((block) => (
                <section key={block.heading} className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0b0910] p-5">
                  <h3 className="text-sm font-semibold text-white">{block.heading}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#A89CC8]">{block.body}</p>
                </section>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-3 border-t border-[#8B5CF6]/12 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="outline"
                disabled={lessonIndex === 0}
                className="border-[#8B5CF6]/16 bg-[#0b0910] text-[#E9D5FF]"
                onClick={() => setLessonIndex((index) => Math.max(0, index - 1))}
              >
                Previous
              </Button>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  className="border-[#8B5CF6]/16 bg-[#0b0910] text-[#E9D5FF]"
                  disabled={saving}
                  onClick={async () => {
                    const next = { ...lessonProgress, [currentLesson.id]: true };
                    setLessonProgress(next);
                    await onSave({ lessonProgress: next, quizScore, status: "in_progress" });
                  }}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark step done
                </Button>
                {lessonIndex < lessons.length - 1 ? (
                  <Button className="bg-[#6D28D9] text-white hover:bg-[#8B5CF6]" onClick={() => setLessonIndex((index) => index + 1)}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button className="bg-[#6D28D9] text-white hover:bg-[#8B5CF6]" onClick={() => setView("quiz")}>
                    Take quiz
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <ListChecks className="h-4 w-4 text-[#C4B5FD]" />
            Practical checklist
          </div>
          <div className="mt-4 space-y-2">
            {(currentLesson?.checklistItems || []).map((item) => (
              <div key={item} className="rounded-xl border border-[#8B5CF6]/12 bg-[#0b0910] p-3 text-sm leading-6 text-[#A89CC8]">
                {item}
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-4">
          <div className="mb-2 flex justify-between text-xs text-[#8f7dbf]">
            <span>Lesson progress</span>
            <span>{percent}%</span>
          </div>
          <Progress value={percent} className="h-2 bg-white/6 [&>div]:bg-gradient-to-r [&>div]:from-[#6D28D9] [&>div]:to-[#C4B5FD]" />
          <p className="mt-4 text-xs leading-5 text-[#8778AD]">
            Training supports awareness and internal readiness. It does not replace legal advice, formal POPIA compliance review, or incident response obligations.
          </p>
          {canComplete && (
            <Button className="mt-4 w-full bg-[#6D28D9] text-white hover:bg-[#8B5CF6]" onClick={() => setView("complete")}>
              View completion
            </Button>
          )}
        </section>
      </aside>
    </div>
  );
}

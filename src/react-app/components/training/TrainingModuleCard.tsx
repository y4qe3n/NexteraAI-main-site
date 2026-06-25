import { ArrowRight, BookOpen, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import { Progress } from "@/react-app/components/ui/progress";
import type { TrainingModule, TrainingProgress } from "@/react-app/training/trainingTypes";

function progressPercent(module: TrainingModule, progress?: TrainingProgress) {
  if (!progress) return 0;
  if (progress.status === "completed") return 100;
  const lessonCount = Math.max(module.lessons.length, 1);
  const completedLessons = module.lessons.filter((lesson) => progress.lessonProgress?.[lesson.id]).length;
  const lessonPercent = Math.round((completedLessons / lessonCount) * 70);
  const quizPercent = progress.quizScore !== null && progress.quizScore !== undefined ? 30 : 0;
  return Math.min(100, lessonPercent + quizPercent);
}

export function TrainingModuleCard({
  module,
  progress,
  recommended,
  onOpen,
}: {
  module: TrainingModule;
  progress?: TrainingProgress;
  recommended?: boolean;
  onOpen: (module: TrainingModule) => void;
}) {
  const percent = progressPercent(module, progress);
  const completed = progress?.status === "completed";
  const started = percent > 0 && !completed;
  const cta = completed ? "Review" : started ? "Continue" : "Start";
  const Icon = completed ? CheckCircle2 : started ? RotateCcw : BookOpen;

  return (
    <article className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-4 shadow-[0_18px_60px_-40px_rgba(124,58,237,0.55)] transition hover:border-[#C4B5FD]/24 hover:bg-[#100d17]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#8B5CF6]/16 bg-[#1A102B] text-[#C4B5FD]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-white">{module.title}</h3>
              {recommended && <Badge className="border-[#C4B5FD]/20 bg-[#8B5CF6]/16 text-[#E9D5FF]">Recommended</Badge>}
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#A89CC8]">{module.description}</p>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 border-[#8B5CF6]/18 text-[#C4B5FD]">
          {module.category}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#8f7dbf]">
        <span className="inline-flex items-center gap-1 rounded-full border border-[#8B5CF6]/12 bg-[#0b0910] px-2.5 py-1">
          <Clock className="h-3.5 w-3.5" />
          {module.estimatedMinutes} min
        </span>
        <span className="rounded-full border border-[#8B5CF6]/12 bg-[#0b0910] px-2.5 py-1">{module.difficulty}</span>
        <span className="rounded-full border border-[#8B5CF6]/12 bg-[#0b0910] px-2.5 py-1">
          {completed ? "Completed" : started ? "In progress" : "Not started"}
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-[#8f7dbf]">
          <span>Completion</span>
          <span>{percent}%</span>
        </div>
        <Progress value={percent} className="h-2 bg-white/6 [&>div]:bg-gradient-to-r [&>div]:from-[#6D28D9] [&>div]:to-[#C4B5FD]" />
      </div>

      <Button
        type="button"
        onClick={() => onOpen(module)}
        className="mt-4 w-full justify-between rounded-xl bg-[#6D28D9] text-white hover:bg-[#8B5CF6]"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </article>
  );
}

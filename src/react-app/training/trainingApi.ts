import { trainingModules } from "./trainingContent";
import type {
  StaffTrainingProgress,
  TrainingActivity,
  TrainingApiState,
  TrainingAssignment,
  TrainingProgress,
  TrainingReport,
} from "./trainingTypes";

export type TrainingDashboardData = {
  progress: TrainingProgress[];
  staff: StaffTrainingProgress[];
  report: TrainingReport;
  activity: TrainingActivity[];
  assignments: TrainingAssignment[];
  apiState: TrainingApiState;
};

const fallbackUserId = "local-current-user";
const fallbackNow = new Date().toISOString();

export function createFallbackTrainingData(reason: string): TrainingDashboardData {
  const progress: TrainingProgress[] = trainingModules.slice(0, 5).map((module, index) => ({
    id: `fallback-progress-${module.id}`,
    userId: fallbackUserId,
    moduleId: module.id,
    lessonProgress: index === 0 ? Object.fromEntries(module.lessons.map((lesson) => [lesson.id, true])) : {},
    quizScore: index === 0 ? 100 : index === 1 ? 60 : null,
    status: index === 0 ? "completed" : index === 1 ? "in_progress" : "not_started",
    lastActivityAt: index <= 1 ? fallbackNow : null,
    completedAt: index === 0 ? fallbackNow : null,
  }));

  return {
    progress,
    staff: [],
    assignments: [],
    activity: [
      {
        id: "fallback-activity-1",
        actor: "Academy",
        action: "Recommended",
        moduleTitle: "Phishing Basics",
        occurredAt: fallbackNow,
      },
    ],
    report: {
      completionRate: 20,
      totalAssigned: 5,
      totalCompleted: 1,
      overdueCount: 0,
      averageQuizScore: 80,
      generatedAt: fallbackNow,
    },
    apiState: { usingFallback: true, fallbackReason: reason },
  };
}

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(error);
  }
  return data as T;
}

export async function loadTrainingDashboardData(isAdmin: boolean): Promise<TrainingDashboardData> {
  try {
    const [meProgressRes, reportRes, orgProgressRes] = await Promise.all([
      fetch("/api/training/progress/me", { credentials: "include" }),
      fetch("/api/training/reports/summary", { credentials: "include" }),
      isAdmin ? fetch("/api/training/org/progress", { credentials: "include" }) : Promise.resolve(null),
    ]);

    const meProgress = await jsonOrThrow<{ progress: TrainingProgress[]; assignments: TrainingAssignment[]; activity: TrainingActivity[] }>(meProgressRes);
    const report = await jsonOrThrow<TrainingReport>(reportRes);
    const orgProgress = orgProgressRes
      ? await jsonOrThrow<{ staff: StaffTrainingProgress[] }>(orgProgressRes)
      : { staff: [] };

    return {
      progress: meProgress.progress || [],
      assignments: meProgress.assignments || [],
      activity: meProgress.activity || [],
      staff: orgProgress.staff || [],
      report,
      apiState: { usingFallback: false },
    };
  } catch (error) {
    return createFallbackTrainingData(error instanceof Error ? error.message : "Training API unavailable");
  }
}

export async function saveTrainingProgress(input: {
  moduleId: string;
  lessonProgress: Record<string, boolean>;
  quizScore: number | null;
  status: string;
}) {
  const res = await fetch("/api/training/progress", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return jsonOrThrow<{ progress: TrainingProgress }>(res);
}

export async function createTrainingAssignments(input: {
  userIds: string[];
  moduleIds: string[];
  dueDate: string | null;
  reminderEnabled: boolean;
}) {
  const res = await fetch("/api/training/assignments", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return jsonOrThrow<{ assignments: TrainingAssignment[]; message?: string }>(res);
}

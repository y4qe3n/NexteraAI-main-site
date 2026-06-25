import { trainingModules } from "@/react-app/training/trainingContent";
import type { StaffTrainingProgress, TrainingActivity, TrainingAssignment, TrainingProgress, TrainingReport } from "@/react-app/training/trainingTypes";

const demoNow = Date.now();

function isoDaysFromNow(days: number) {
  return new Date(demoNow + days * 24 * 60 * 60 * 1000).toISOString();
}

function isoDaysAgo(days: number) {
  return new Date(demoNow - days * 24 * 60 * 60 * 1000).toISOString();
}

export const demoStaff: StaffTrainingProgress[] = [
  { userId: "demo-admin-user", name: "Demo Admin", email: "demo.admin@nexteraai.local", role: "org_admin", assignedModules: 5, completionPercent: 80, lastActivityAt: isoDaysAgo(1), overdue: false, riskCategory: "Low" },
  { userId: "demo-finance-user", name: "Finance Lead", email: "finance@nexteraai.local", role: "member", assignedModules: 5, completionPercent: 60, lastActivityAt: isoDaysAgo(2), overdue: false, riskCategory: "Medium" },
  { userId: "demo-frontdesk-user", name: "Front Desk", email: "frontdesk@nexteraai.local", role: "member", assignedModules: 4, completionPercent: 45, lastActivityAt: isoDaysAgo(4), overdue: true, riskCategory: "High" },
  { userId: "demo-ops-user", name: "Operations", email: "operations@nexteraai.local", role: "member", assignedModules: 4, completionPercent: 25, lastActivityAt: isoDaysAgo(6), overdue: true, riskCategory: "High" },
];

export let demoTrainingProgress: TrainingProgress[] = trainingModules.slice(0, 5).map((module, index) => ({
  id: `demo-progress-${module.id}`,
  orgId: "nxorg_demo_local_preview",
  userId: "demo-admin-user",
  moduleId: module.id,
  lessonProgress:
    index <= 1
      ? Object.fromEntries(module.lessons.map((lesson) => [lesson.id, true]))
      : index === 2
        ? Object.fromEntries(module.lessons.slice(0, 1).map((lesson) => [lesson.id, true]))
        : {},
  quizScore: index === 0 ? 100 : index === 1 ? 88 : index === 2 ? 70 : null,
  status: index <= 1 ? "completed" : index === 2 ? "in_progress" : "not_started",
  lastActivityAt: index <= 2 ? isoDaysAgo(index + 1) : null,
  completedAt: index <= 1 ? isoDaysAgo(index + 1) : null,
}));

export const demoTrainingAssignments: TrainingAssignment[] = trainingModules.slice(0, 5).flatMap((module, moduleIndex) =>
  demoStaff.map((staff, staffIndex) => ({
    id: `demo-assignment-${module.id}-${staff.userId}`,
    orgId: "nxorg_demo_local_preview",
    moduleId: module.id,
    assignedToUserId: staff.userId,
    assignedByUserId: "demo-admin-user",
    dueDate: isoDaysFromNow(moduleIndex - staffIndex + 5),
    status: staff.completionPercent >= 80 && moduleIndex < 4 ? "completed" : staff.overdue && moduleIndex < 2 ? "overdue" : "in_progress",
    createdAt: isoDaysAgo(10),
    completedAt: staff.completionPercent >= 80 && moduleIndex < 4 ? isoDaysAgo(2) : null,
  })),
);

export const demoTrainingActivity: TrainingActivity[] = [
  { id: "demo-training-activity-1", actor: "Demo Admin", action: "Completed", moduleTitle: "Phishing Basics", occurredAt: isoDaysAgo(1) },
  { id: "demo-training-activity-2", actor: "Finance Lead", action: "Scored 88%", moduleTitle: "Password Safety", occurredAt: isoDaysAgo(2) },
  { id: "demo-training-activity-3", actor: "Front Desk", action: "Started", moduleTitle: "POPIA Awareness", occurredAt: isoDaysAgo(4) },
];

export const demoTrainingReport: TrainingReport = {
  orgId: "nxorg_demo_local_preview",
  completionRate: 52,
  totalAssigned: demoTrainingAssignments.length,
  totalCompleted: demoTrainingAssignments.filter((assignment) => assignment.status === "completed").length,
  overdueCount: demoTrainingAssignments.filter((assignment) => assignment.status === "overdue").length,
  averageQuizScore: 86,
  generatedAt: new Date(demoNow).toISOString(),
};

export function saveDemoTrainingProgress(input: {
  moduleId: string;
  lessonProgress: Record<string, boolean>;
  quizScore: number | null;
  status: string;
}) {
  const progress: TrainingProgress = {
    id: `demo-progress-${input.moduleId}`,
    orgId: "nxorg_demo_local_preview",
    userId: "demo-admin-user",
    moduleId: input.moduleId,
    lessonProgress: input.lessonProgress,
    quizScore: input.quizScore,
    status: input.status === "completed" ? "completed" : "in_progress",
    lastActivityAt: new Date().toISOString(),
    completedAt: input.status === "completed" ? new Date().toISOString() : null,
  };
  demoTrainingProgress = demoTrainingProgress.filter((entry) => entry.moduleId !== input.moduleId).concat(progress);
  return progress;
}

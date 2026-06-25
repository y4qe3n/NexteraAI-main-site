export type TrainingDifficulty = "Basic" | "Intermediate";
export type TrainingStatus = "not_started" | "in_progress" | "completed" | "overdue";
export type TrainingCategory =
  | "Phishing"
  | "Passwords"
  | "POPIA"
  | "Browsing"
  | "Email"
  | "Social Engineering"
  | "Devices"
  | "Alerts"
  | "Ransomware"
  | "Remote Work";

export type ContentBlock = {
  heading: string;
  body: string;
};

export type Lesson = {
  id: string;
  title: string;
  order: number;
  contentBlocks: ContentBlock[];
  checklistItems: string[];
};

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
};

export type TrainingModule = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: TrainingCategory;
  estimatedMinutes: number;
  difficulty: TrainingDifficulty;
  recommendedFor: string[];
  lessons: Lesson[];
  quiz: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
};

export type TrainingProgress = {
  id?: string;
  orgId?: string;
  userId: string;
  moduleId: string;
  lessonProgress: Record<string, boolean>;
  quizScore: number | null;
  status: TrainingStatus;
  lastActivityAt: string | null;
  completedAt?: string | null;
};

export type TrainingAssignment = {
  id: string;
  orgId?: string;
  moduleId: string;
  assignedToUserId: string;
  assignedByUserId?: string;
  dueDate: string | null;
  status: TrainingStatus;
  createdAt: string;
  completedAt?: string | null;
};

export type StaffTrainingProgress = {
  userId: string;
  name: string;
  email: string;
  role: string;
  assignedModules: number;
  completionPercent: number;
  lastActivityAt: string | null;
  overdue: boolean;
  riskCategory: "Low" | "Medium" | "High";
};

export type TrainingReport = {
  orgId?: string;
  completionRate: number;
  totalAssigned: number;
  totalCompleted: number;
  overdueCount: number;
  averageQuizScore: number;
  generatedAt: string;
};

export type TrainingActivity = {
  id: string;
  actor: string;
  action: string;
  moduleTitle: string;
  occurredAt: string;
};

export type TrainingApiState = {
  usingFallback: boolean;
  fallbackReason?: string;
};

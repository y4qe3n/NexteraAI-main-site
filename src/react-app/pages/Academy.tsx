import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  GraduationCap,
  Layers3,
  ListChecks,
  Loader2,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import { Progress } from "@/react-app/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/react-app/components/ui/tabs";
import { useAuth } from "@/react-app/lib/AuthContext";
import { ROLE_ADMIN } from "@/react-app/constants/roles";
import { LessonPlayer } from "@/react-app/components/training/LessonPlayer";
import { StaffTrainingProgress } from "@/react-app/components/training/StaffTrainingProgress";
import { TrainingAssignmentModal } from "@/react-app/components/training/TrainingAssignmentModal";
import { TrainingModuleCard } from "@/react-app/components/training/TrainingModuleCard";
import { TrainingReports } from "@/react-app/components/training/TrainingReports";
import { createTrainingAssignments, loadTrainingDashboardData, saveTrainingProgress, type TrainingDashboardData } from "@/react-app/training/trainingApi";
import { passThreshold, trainingModules } from "@/react-app/training/trainingContent";
import type { TrainingModule, TrainingProgress } from "@/react-app/training/trainingTypes";

function pct(value: number) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

function formatRelative(value: string | null) {
  if (!value) return "No activity yet";
  const ms = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(ms / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function statusFor(progress?: TrainingProgress) {
  if (progress?.status === "completed") return "Completed";
  if (progress?.status === "in_progress") return "In progress";
  return "Not started";
}

function AcademyMetric({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#8778AD]">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{value}</p>
        </div>
        <div className="rounded-xl border border-[#8B5CF6]/18 bg-[#1A102B] p-3 text-[#C4B5FD]">{icon}</div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#A89CC8]">{detail}</p>
    </div>
  );
}

function TrainingEmptyState({ onAssign }: { onAssign: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#8B5CF6]/20 bg-[#0d0b12] p-8 text-center">
      <GraduationCap className="mx-auto h-9 w-9 text-[#C4B5FD]" />
      <h3 className="mt-4 text-lg font-semibold text-white">No training assigned yet.</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#A89CC8]">
        Start with Phishing Basics for your organisation, then add POPIA Awareness and Password Safety as staff complete the first module.
      </p>
      <Button className="mt-5 bg-[#6D28D9] text-white hover:bg-[#8B5CF6]" onClick={onAssign}>
        Assign training
      </Button>
    </div>
  );
}

export function AcademyPage() {
  const { admin } = useAuth();
  const location = useLocation();
  const isAdmin = (admin?.role || ROLE_ADMIN) === ROLE_ADMIN;
  const [data, setData] = useState<TrainingDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const defaultTab = location.pathname.endsWith("/modules")
    ? "library"
    : location.pathname.endsWith("/reports")
      ? "reports"
      : "overview";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const progressByModule = useMemo(() => {
    const map = new Map<string, TrainingProgress>();
    (data?.progress || []).forEach((entry) => map.set(entry.moduleId, entry));
    return map;
  }, [data?.progress]);

  const recommendedModules = useMemo(() => {
    const priorities = ["mod_phishing_basics", "mod_alert_response", "mod_popia_awareness"];
    return priorities
      .map((id) => trainingModules.find((module) => module.id === id))
      .filter((module): module is TrainingModule => Boolean(module));
  }, []);

  const nextModule = useMemo(() => {
    return recommendedModules.find((module) => progressByModule.get(module.id)?.status !== "completed") || trainingModules[0];
  }, [progressByModule, recommendedModules]);

  const completedCount = data?.progress.filter((entry) => entry.status === "completed").length || 0;
  const completionRate = data?.report.completionRate ?? 0;
  const staffCount = data?.staff.length || (admin ? 1 : 0);
  const overdueCount = data?.report.overdueCount ?? 0;
  const averageQuizScore = data?.report.averageQuizScore ?? 0;

  const refresh = async () => {
    setLoading(true);
    const loaded = await loadTrainingDashboardData(isAdmin);
    setData(loaded);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleSaveProgress = async (module: TrainingModule, input: { lessonProgress: Record<string, boolean>; quizScore: number | null; status: string }) => {
    setSaving(true);
    try {
      if (data?.apiState.usingFallback) {
        const updated: TrainingProgress = {
          id: `fallback-progress-${module.id}`,
          userId: admin?.id || "local-current-user",
          moduleId: module.id,
          lessonProgress: input.lessonProgress,
          quizScore: input.quizScore,
          status: input.status === "completed" ? "completed" : "in_progress",
          lastActivityAt: new Date().toISOString(),
          completedAt: input.status === "completed" ? new Date().toISOString() : null,
        };
        setData((current) => {
          if (!current) return current;
          const nextProgress = current.progress.filter((entry) => entry.moduleId !== module.id).concat(updated);
          return { ...current, progress: nextProgress };
        });
        setNotice("Progress saved locally for this session because the training database tables are not available.");
        return;
      }
      await saveTrainingProgress({ moduleId: module.id, ...input });
      setNotice("Progress saved.");
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to save progress.");
    } finally {
      setSaving(false);
    }
  };

  const handleAssign = async (input: { userIds: string[]; moduleIds: string[]; dueDate: string | null; reminderEnabled: boolean }) => {
    if (data?.apiState.usingFallback) {
      setNotice("Assignment flow is visible, but database-backed assignments require migration 29.");
      return;
    }
    await createTrainingAssignments(input);
    setNotice(input.reminderEnabled ? "Training assigned. Reminder request recorded; email delivery is not connected here." : "Training assigned.");
    await refresh();
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-6xl items-center justify-center px-4 py-10">
        <div className="flex items-center gap-3 rounded-full border border-[#8B5CF6]/12 bg-[#0c0a11] px-5 py-3 text-sm text-[#A89CC8]">
          <Loader2 className="h-4 w-4 animate-spin text-[#C4B5FD]" />
          Loading Security Academy
        </div>
      </div>
    );
  }

  if (selectedModule) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <LessonPlayer
          module={selectedModule}
          progress={progressByModule.get(selectedModule.id)}
          saving={saving}
          onBack={() => setSelectedModule(null)}
          onSave={(input) => handleSaveProgress(selectedModule, input)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[#8B5CF6]/12 bg-[linear-gradient(180deg,rgba(13,11,18,0.99),rgba(5,4,10,0.99))] p-6 shadow-[0_35px_90px_-45px_rgba(124,58,237,0.55)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#8778AD]">Customer dashboard</p>
              <Badge className="border-[#C4B5FD]/20 bg-[#8B5CF6]/16 text-[#E9D5FF]">Security Academy</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              Security Academy
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A89CC8] sm:text-base">
              Train your team to recognise cyber risks before they become incidents.
            </p>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-3 xl:min-w-[520px]">
            <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0a0810] p-4">
              <p className="text-[11px] uppercase tracking-[0.26em] text-[#8778AD]">Readiness</p>
              <p className="mt-2 text-3xl font-semibold text-white">{pct(completionRate)}</p>
            </div>
            <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0a0810] p-4">
              <p className="text-[11px] uppercase tracking-[0.26em] text-[#8778AD]">Staff</p>
              <p className="mt-2 text-3xl font-semibold text-white">{staffCount}</p>
            </div>
            <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0a0810] p-4">
              <p className="text-[11px] uppercase tracking-[0.26em] text-[#8778AD]">Overdue</p>
              <p className="mt-2 text-3xl font-semibold text-white">{overdueCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button className="bg-[#6D28D9] text-white hover:bg-[#8B5CF6]" onClick={() => setAssignmentOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Assign training
          </Button>
          <Button variant="outline" className="border-[#8B5CF6]/16 bg-[#0b0910] text-[#E9D5FF]" onClick={() => setSelectedModule(nextModule)}>
            <BookOpen className="mr-2 h-4 w-4" />
            Start next lesson
          </Button>
          <Button asChild variant="outline" className="border-[#8B5CF6]/16 bg-[#0b0910] text-[#E9D5FF]">
            <a href="/api/training/reports/export.csv" download>
              <Download className="mr-2 h-4 w-4" />
              Download report
            </a>
          </Button>
        </div>

        {(notice || data?.apiState.usingFallback) && (
          <div className="mt-5 rounded-2xl border border-amber-300/18 bg-amber-400/8 p-4 text-sm leading-6 text-amber-100">
            {notice || `Training API fallback active: ${data?.apiState.fallbackReason}. Apply migration 29 to enable database-backed assignments and progress.`}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <AcademyMetric label="Completion rate" value={pct(completionRate)} detail={`${completedCount} saved completions across available modules.`} icon={<CheckCircle2 className="h-5 w-5" />} />
        <AcademyMetric label="Staff enrolled" value={staffCount} detail="Organisation members visible to this dashboard role." icon={<Users className="h-5 w-5" />} />
        <AcademyMetric label="Overdue lessons" value={overdueCount} detail="Modules past due date need follow-up." icon={<Clock className="h-5 w-5" />} />
        <AcademyMetric label="Quiz average" value={pct(averageQuizScore)} detail={`Pass threshold is ${passThreshold}%.`} icon={<ListChecks className="h-5 w-5" />} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-1">
          <TabsTrigger value="overview" className="rounded-xl px-4 py-2">Overview</TabsTrigger>
          <TabsTrigger value="library" className="rounded-xl px-4 py-2">Modules</TabsTrigger>
          <TabsTrigger value="staff" className="rounded-xl px-4 py-2">Staff progress</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-xl px-4 py-2">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[#8778AD]">
                    <Sparkles className="h-4 w-4" />
                    Recommended next action
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-white">{nextModule.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A89CC8]">{nextModule.description}</p>
                </div>
                <Button className="hidden bg-[#6D28D9] text-white hover:bg-[#8B5CF6] sm:inline-flex" onClick={() => setSelectedModule(nextModule)}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {recommendedModules.map((module) => (
                  <div key={module.id} className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0b0910] p-4">
                    <p className="text-sm font-semibold text-white">{module.title}</p>
                    <p className="mt-2 text-xs leading-5 text-[#A89CC8]">{statusFor(progressByModule.get(module.id))}</p>
                    <Progress value={progressByModule.get(module.id)?.status === "completed" ? 100 : progressByModule.get(module.id) ? 45 : 0} className="mt-3 h-2 bg-white/6 [&>div]:bg-gradient-to-r [&>div]:from-[#6D28D9] [&>div]:to-[#C4B5FD]" />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[#8778AD]">
                <ShieldAlert className="h-4 w-4" />
                Risk topics needing attention
              </div>
              <div className="mt-4 space-y-3">
                {["Phishing", "POPIA", "Suspicious attachments"].map((topic) => (
                  <div key={topic} className="flex items-center justify-between rounded-xl border border-[#8B5CF6]/12 bg-[#0b0910] p-3">
                    <span className="text-sm text-white">{topic}</span>
                    <Badge variant="outline" className="border-amber-300/24 text-amber-100">Recommended</Badge>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-[#8778AD]">
                Recommendations are general unless live alert data is available. They do not claim active AI/ML detection.
              </p>
            </section>

            <section className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-5 xl:col-span-2">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[#8778AD]">
                <Layers3 className="h-4 w-4" />
                Recent training activity
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {(data?.activity || []).length > 0 ? (
                  data?.activity.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0b0910] p-4">
                      <p className="text-sm font-semibold text-white">{activity.action}</p>
                      <p className="mt-1 text-sm text-[#A89CC8]">{activity.moduleTitle}</p>
                      <p className="mt-3 text-xs text-[#8778AD]">{formatRelative(activity.occurredAt)}</p>
                    </div>
                  ))
                ) : (
                  <TrainingEmptyState onAssign={() => setAssignmentOpen(true)} />
                )}
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="library" className="mt-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Training Modules Library</h2>
              <p className="mt-1 text-sm text-[#A89CC8]">Recommended modules are surfaced first, with the rest available for assignment.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trainingModules.map((module) => (
              <TrainingModuleCard
                key={module.id}
                module={module}
                progress={progressByModule.get(module.id)}
                recommended={recommendedModules.some((recommended) => recommended.id === module.id)}
                onOpen={setSelectedModule}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="staff" className="mt-5">
          {isAdmin ? (
            <StaffTrainingProgress staff={data?.staff || []} onAssign={() => setAssignmentOpen(true)} />
          ) : (
            <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-6">
              <h3 className="text-lg font-semibold text-white">Your training</h3>
              <p className="mt-2 text-sm leading-6 text-[#A89CC8]">Staff progress views are available to organisation admins. Your own assigned lessons are visible in the module library.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="mt-5">
          <TrainingReports report={data?.report || { completionRate: 0, totalAssigned: 0, totalCompleted: 0, overdueCount: 0, averageQuizScore: 0, generatedAt: new Date().toISOString() }} />
        </TabsContent>
      </Tabs>

      <div className="mt-6 rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-4 text-xs leading-5 text-[#8778AD]">
        <AlertTriangle className="mr-2 inline h-4 w-4 text-[#C4B5FD]" />
        Training supports awareness and internal readiness. It does not replace legal advice, formal POPIA compliance review, or incident response obligations.
        For POPIA workflows, review the <Link className="text-[#C4B5FD] hover:text-white" to="/dashboard/compliance">Compliance Hub</Link>.
      </div>

      <TrainingAssignmentModal
        open={assignmentOpen}
        staff={data?.staff || []}
        modules={trainingModules}
        onClose={() => setAssignmentOpen(false)}
        onAssign={handleAssign}
      />
    </div>
  );
}

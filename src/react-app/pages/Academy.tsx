import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/react-app/components/ui/radio-group";
import { Label } from "@/react-app/components/ui/label";
import { Loader2, GraduationCap, CheckCircle, FileText, X, Award, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/react-app/lib/AuthContext";
import { ROLE_ADMIN } from "@/react-app/constants/roles";

type Module = {
  id: number;
  title: string;
  description: string;
  duration: number;
  progress: number;
  status: string;
};

type EmployeeProgress = {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  moduleScores: Record<number, number>;
  overallProgress: number;
  completedModules: number;
  lastActivity: string;
};

type EmployeeUser = {
  id: number;
  email: string;
  full_name?: string | null;
  role: string;
  last_login: string | null;
};

type AcademyProgressEntry = {
  userId: number;
  moduleScores?: Record<number, number>;
  overallProgress?: number;
  completedModules?: number;
  lastActivity?: string;
};

const FALLBACK_EMPLOYEES: EmployeeUser[] = [
  { id: 1, email: "employee1@company.com", full_name: "John Doe", role: "employee", last_login: "2024-01-15T10:00:00Z" },
  { id: 2, email: "employee2@company.com", full_name: "Jane Smith", role: "employee", last_login: "2024-01-16T11:00:00Z" },
];

const FALLBACK_PROGRESS: AcademyProgressEntry[] = [
  { userId: 1, moduleScores: { 1: 100, 2: 80, 3: 0, 4: 0 }, overallProgress: 45, completedModules: 2, lastActivity: "2024-01-15" },
  { userId: 2, moduleScores: { 1: 100, 2: 100, 3: 100, 4: 90 }, overallProgress: 97, completedModules: 4, lastActivity: "2024-01-16" },
];

const formatLastActivity = (value?: string | null) => (value ? new Date(value).toLocaleString() : "—");

const buildEmployeeProgressList = (
  users: EmployeeUser[],
  progressEntries: AcademyProgressEntry[],
  modules: Module[]
): EmployeeProgress[] => {
  const moduleIds = modules.length > 0 ? modules.map((mod) => mod.id) : Object.keys(MODULE_DURATIONS).map((id) => Number(id));
  const defaultScores = moduleIds.reduce<Record<number, number>>((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {});

  return users.map((user) => {
    const progress = progressEntries.find((entry) => entry.userId === user.id);
    const mergedScores = { ...defaultScores, ...(progress?.moduleScores || {}) };
    const scoreValues = Object.values(mergedScores);
    const overall = moduleIds.length > 0 ? Math.round(scoreValues.reduce((sum, value) => sum + value, 0) / moduleIds.length) : 0;
    const completed = scoreValues.filter((score) => score >= 70).length;

    return {
      userId: user.id,
      email: user.email,
      fullName: user.full_name || user.email,
      role: user.role,
      moduleScores: mergedScores,
      overallProgress: progress?.overallProgress ?? overall,
      completedModules: progress?.completedModules ?? completed,
      lastActivity: progress?.lastActivity || formatLastActivity(user.last_login),
    };
  });
};

type QuizQuestion = { id: number; question: string; options: string[]; correct: string };

const MODULE_PDF_MAP: Record<number, string> = {
  1: "/academy/NexteraAI-Academy-Module-1-Introduction-to-Cybersecurity.pdf",
  2: "/academy/NexteraAI-Academy-Module-2-Phishing-Prevention.pdf",
  3: "/academy/NexteraAI-Academy-Module-3-Password-Management.pdf",
  4: "/academy/NexteraAI-Academy-Module-4-Data-Privacy-Essentials.pdf",
};

// Duration in minutes (reading time + test time estimate)
const MODULE_DURATIONS: Record<number, number> = {
  1: 25, // ~20 min reading + 5 min test (3 questions)
  2: 35, // ~25 min reading + 10 min test (4 questions)
  3: 35, // ~25 min reading + 10 min test (4 questions)
  4: 30, // ~22 min reading + 8 min test (3 questions)
};

const MODULE_QUIZZES: Record<number, QuizQuestion[]> = {
  1: [
    { id: 1, question: "How many cyber attacks hit SA organisations per week on average in recent reports?", options: ["~500", "~2,100+", "~10,000"], correct: "1" },
    { id: 2, question: "What does the 'A' in CIA Triad stand for?", options: ["Authentication", "Availability", "Access"], correct: "1" },
    { id: 3, question: "Which is the #1 quick action to take today?", options: ["Buy expensive firewall", "Enable MFA", "Ignore updates"], correct: "1" },
  ],
  2: [
    { id: 1, question: "Phishing is the top threat in SA because it makes up what % of attacks?", options: ["10%", "45%+", "5%"], correct: "1" },
    { id: 2, question: "Real SARS/FNB will NEVER ask for?", options: ["Your name", "OTP via SMS", "Feedback"], correct: "1" },
    { id: 3, question: "Best first step on a suspicious link?", options: ["Click to check", "Hover to see URL", "Forward to friend"], correct: "1" },
    { id: 4, question: "If in doubt, forward to?", options: ["The sender", "phishing@sars.gov.za or bank fraud line", "Ignore"], correct: "1" },
  ],
  3: [
    { id: 1, question: "What % of breaches start with stolen/compromised credentials (Verizon 2025)?", options: ["5%", "22%", "50%"], correct: "1" },
    { id: 2, question: "Modern best practice: Length or complexity first?", options: ["Complexity", "Length (12\u201316+ chars)", "Change every month"], correct: "1" },
    { id: 3, question: "Best free password manager for small businesses?", options: ["Sticky notes", "Bitwarden", "Reuse same one"], correct: "1" },
    { id: 4, question: "When to force a password change?", options: ["Every 90 days", "Only if breached", "Never"], correct: "1" },
  ],
  4: [
    { id: 1, question: "What's the max fine under POPIA?", options: ["R1 million", "R10 million", "No fines"], correct: "1" },
    { id: 2, question: "How many conditions for lawful processing?", options: ["5", "8", "10"], correct: "1" },
    { id: 3, question: "First step for most small businesses?", options: ["Ignore it", "Appoint Information Officer + add privacy notice", "Hire lawyer"], correct: "1" },
  ],
};

export function AcademyPage() {
  const { admin } = useAuth();
  const userRole = admin?.role || ROLE_ADMIN;
  const isAdmin = userRole === ROLE_ADMIN;
  
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showPDF, setShowPDF] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [testScore, setTestScore] = useState<number | null>(null);
  const [moduleScores, setModuleScores] = useState<Record<number, number>>({});
  
  // Admin view states
  const [employeeProgress, setEmployeeProgress] = useState<EmployeeProgress[]>([]);
  const [employeeUsers, setEmployeeUsers] = useState<EmployeeUser[]>(FALLBACK_EMPLOYEES);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    // Load saved scores from localStorage
    const savedScores = localStorage.getItem('academy_module_scores');
    if (savedScores) {
      setModuleScores(JSON.parse(savedScores));
    }
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/training-modules", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load training modules");
        const data = await res.json();
        setModules(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  // Fetch employee progress for admin view
  useEffect(() => {
    if (!isAdmin) {
      setEmployeeProgress([]);
      return;
    }

    const fetchAdminData = async () => {
      try {
        setAdminLoading(true);
        const [usersRes, progressRes] = await Promise.all([
          fetch("/api/admin/users?role=employee&limit=100", { credentials: "include" }),
          fetch("/api/admin/academy-progress", { credentials: "include" }),
        ]);

        let users: EmployeeUser[] = FALLBACK_EMPLOYEES;
        let progressEntries: AcademyProgressEntry[] = FALLBACK_PROGRESS;

        if (usersRes.ok) {
          const data = await usersRes.json();
          users = data.users || FALLBACK_EMPLOYEES;
        }

        if (progressRes.ok) {
          const data = await progressRes.json();
          progressEntries = data.progress || FALLBACK_PROGRESS;
        }

        setEmployeeUsers(users);
        setEmployeeProgress(buildEmployeeProgressList(users, progressEntries, modules));
      } catch (err) {
        setEmployeeUsers(FALLBACK_EMPLOYEES);
        setEmployeeProgress(buildEmployeeProgressList(FALLBACK_EMPLOYEES, FALLBACK_PROGRESS, modules));
      } finally {
        setAdminLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin, modules]);


  // Calculate progress based on test scores (score is the progress percentage)
  const overallProgress = modules.length > 0 
    ? Math.round(modules.reduce((sum, m) => sum + (moduleScores[m.id] || 0), 0) / modules.length) 
    : 0;
  // A module is considered completed if test score >= 70%
  const completedModules = modules.filter(m => (moduleScores[m.id] || 0) >= 70).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-destructive">
          <GraduationCap className="w-6 h-6" />
          <div>
            <p className="font-medium">Failed to load academy content</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Security Academy</h2>
          <p className="text-sm text-muted-foreground">
            Learn best practices for cybersecurity and compliance.
          </p>
        </div>
        <div className="flex gap-2">
          {/* View Certificates button removed */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Overall Progress
            </p>
            <p className="text-2xl font-semibold mt-1">{overallProgress}%</p>
          </div>
          <GraduationCap className="w-6 h-6 text-primary relative z-10" />
        </Card>
        <Card className="p-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Completed Modules
            </p>
            <p className="text-2xl font-semibold mt-1">{completedModules} / {modules.length}</p>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-400 relative z-10" />
        </Card>
        <Card className="p-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Estimated Time Left
            </p>
            <p className="text-2xl font-semibold mt-1">
              {Math.round(modules.reduce((sum, m) => sum + ((MODULE_DURATIONS[m.id] || 30) * (100 - (moduleScores[m.id] || 0)) / 100), 0))} min
            </p>
          </div>
          <GraduationCap className="w-6 h-6 text-primary relative z-10" />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => {
          const score = moduleScores[module.id] || 0;
          const isCompleted = score >= 70;
          const isStarted = score > 0;
          return (
          <Card key={module.id} className="p-4 flex flex-col gap-3 relative overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all">
            <div className={`absolute inset-0 bg-gradient-to-br ${isCompleted ? 'from-emerald-500/10' : isStarted ? 'from-amber-500/10' : 'from-primary/5'} via-transparent to-transparent pointer-events-none`} />
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div>
                <h3 className="font-semibold text-lg">{module.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
              </div>
              <Badge
                variant="outline"
                className={
                  isCompleted
                    ? "border-emerald-500/40 text-emerald-400"
                    : isStarted
                    ? "border-amber-500/40 text-amber-400"
                    : "border-muted-foreground/40 text-muted-foreground"
                }
              >
                {isCompleted ? "Completed" : isStarted ? "In Progress" : "Not Started"}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground relative z-10">
              <span>Duration: {MODULE_DURATIONS[module.id] || 30} min</span>
              <span>Best Score: {score}%</span>
            </div>

            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden relative z-10">
              <div
                className={`h-full transition-all duration-300 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-primary'}`}
                style={{ width: `${score}%` }}
              />
            </div>

            <div className="flex justify-end gap-2 relative z-10">
              <Button
                variant="outline"
                size="sm"
                className="text-white"
                onClick={() => {
                  setSelectedModule(module);
                  setShowPDF(true);
                  setShowTest(false);
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Read PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-white"
                onClick={() => {
                  setSelectedModule(module);
                  setShowTest(true);
                  setShowPDF(false);
                  setTestScore(null);
                  setTestAnswers({});
                }}
              >
                <Award className="w-4 h-4 mr-2" />
                Take Test
              </Button>
            </div>
          </Card>
        );
      })}
      </div>

      {/* Admin View - Employee Progress Overview */}
      {isAdmin && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Employee Progress Overview</h3>
            <span className="text-xs text-muted-foreground">{employeeUsers.length} tracked employees</span>
          </div>
          
          {adminLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : employeeProgress.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No employee progress data available
            </Card>
          ) : (
            <div className="grid gap-4">
              {employeeProgress.map((employee) => (
                <Card key={employee.userId} className="p-4 relative overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all">
                  <div className={`absolute inset-0 bg-gradient-to-br ${employee.overallProgress >= 70 ? 'from-emerald-500/10' : employee.overallProgress > 0 ? 'from-amber-500/10' : 'from-primary/5'} via-transparent to-transparent pointer-events-none`} />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div className="flex-1">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-semibold text-white">{employee.fullName}</h4>
                        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs text-muted-foreground">{employee.email}</Badge>
                          <span className="capitalize">{employee.role.replace("ROLE_", "")}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Overall Progress</p>
                        <p className="text-xl font-semibold">{employee.overallProgress}%</p>
                      </div>
                      <TrendingUp className={`w-6 h-6 ${employee.overallProgress >= 70 ? 'text-emerald-400' : 'text-amber-400'}`} />
                    </div>
                  </div>
                  
                  {/* Module scores breakdown */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {modules.map((mod) => {
                      const score = employee.moduleScores[mod.id] || 0;
                      return (
                        <div key={mod.id} className="bg-muted/30 rounded p-2">
                          <p className="text-xs text-muted-foreground truncate">{mod.title}</p>
                          <p className={`text-sm font-medium ${score >= 70 ? 'text-emerald-400' : score > 0 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                            {score}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPDF && selectedModule && (
        <Card className="fixed inset-4 z-50 p-4 overflow-hidden flex flex-col bg-background">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{selectedModule.title} - Reading Material</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowPDF(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {MODULE_PDF_MAP[selectedModule.id] ? (
            <iframe
              src={MODULE_PDF_MAP[selectedModule.id]}
              className="flex-1 w-full rounded border border-border"
              title={selectedModule.title}
            />
          ) : (
            <div className="flex-1 bg-muted/30 rounded flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium">PDF not available</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPDF(false)}>Close</Button>
            <Button onClick={() => {
              setShowPDF(false);
              setShowTest(true);
              setTestScore(null);
              setTestAnswers({});
            }}>Take Test</Button>
          </div>
        </Card>
      )}

      {/* Test Modal */}
      {showTest && selectedModule && (() => {
        const questions = MODULE_QUIZZES[selectedModule.id] || [];
        const totalQ = questions.length;
        return (
        <Card className="fixed inset-4 z-50 p-4 overflow-hidden flex flex-col bg-background">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{selectedModule.title} - Assessment</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowTest(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {testScore !== null ? (
              <div className="text-center py-8">
                <Award className={`w-16 h-16 mx-auto mb-4 ${testScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`} />
                <p className="text-2xl font-bold">Score: {testScore}%</p>
                <p className="text-muted-foreground mt-2">
                  {testScore >= 70 ? 'Congratulations! You passed!' : 'Review the material and try again.'}
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowTest(false)}>Close</Button>
                  {testScore < 70 && (
                    <Button onClick={() => {
                      setTestScore(null);
                      setTestAnswers({});
                    }}>Retry</Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-muted/30 rounded">
                    <p className="font-medium mb-3">{idx + 1}. {q.question}</p>
                    <RadioGroup
                      value={testAnswers[q.id]}
                      onValueChange={(v) => setTestAnswers({...testAnswers, [q.id]: v})}
                    >
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2 py-1">
                          <RadioGroupItem value={String(optIdx)} id={`q${selectedModule.id}-${q.id}-opt${optIdx}`} />
                          <Label htmlFor={`q${selectedModule.id}-${q.id}-opt${optIdx}`} className="cursor-pointer">{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
                {totalQ === 0 && (
                  <p className="text-center text-muted-foreground">No quiz available for this module yet.</p>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowTest(false)}>Cancel</Button>
                  <Button
                    onClick={() => {
                      let correct = 0;
                      questions.forEach((q) => {
                        if (testAnswers[q.id] === q.correct) correct++;
                      });
                      const score = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;
                      setTestScore(score);
                      // Save score to moduleScores (keep highest score)
                      if (selectedModule) {
                        const currentScore = moduleScores[selectedModule.id] || 0;
                        const newScore = Math.max(currentScore, score);
                        const updatedScores = { ...moduleScores, [selectedModule.id]: newScore };
                        setModuleScores(updatedScores);
                        localStorage.setItem('academy_module_scores', JSON.stringify(updatedScores));
                      }
                    }}
                    disabled={Object.keys(testAnswers).length < totalQ}
                  >
                    Submit Test
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
        );
      })()}
    </div>
  );
}

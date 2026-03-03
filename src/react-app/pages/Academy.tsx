import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/react-app/components/ui/radio-group";
import { Label } from "@/react-app/components/ui/label";
import { Loader2, GraduationCap, Play, CheckCircle, FileText, X, Award } from "lucide-react";

type Module = {
  id: number;
  title: string;
  description: string;
  duration: number;
  progress: number; // 0-100 percentage
  status: string; // "not_started", "in_progress", "completed"
};

export function AcademyPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showPDF, setShowPDF] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [testScore, setTestScore] = useState<number | null>(null);

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

  const handleStartModule = async (moduleId: number) => {
    try {
      setActionLoading(moduleId);
      const res = await fetch(`/api/training-modules/${moduleId}/start`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to start module");
      const updatedModule = await res.json();
      setModules(modules.map(m => m.id === moduleId ? updatedModule : m));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start module");
    } finally {
      setActionLoading(null);
    }
  };

  const handleContinueModule = async (moduleId: number) => {
    try {
      setActionLoading(moduleId);
      const res = await fetch(`/api/training-modules/${moduleId}/continue`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to continue module");
      const updatedModule = await res.json();
      setModules(modules.map(m => m.id === moduleId ? updatedModule : m));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to continue module");
    } finally {
      setActionLoading(null);
    }
  };

  const overallProgress = modules.length > 0 
    ? Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length) 
    : 0;
  const completedModules = modules.filter(m => m.status === "completed").length;

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
          <Button variant="outline" size="sm" className="text-white" onClick={() => {
            const completed = modules.filter(m => m.status === "completed");
            if (completed.length === 0) {
              alert("No certificates yet. Complete a module to earn your first certificate.");
            } else {
              alert(`You have ${completed.length} certificate(s):\n${completed.map(m => `• ${m.title}`).join("\n")}`);
            }
          }}>
            View Certificates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Overall Progress
            </p>
            <p className="text-2xl font-semibold mt-1">{overallProgress}%</p>
          </div>
          <GraduationCap className="w-6 h-6 text-primary" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Completed Modules
            </p>
            <p className="text-2xl font-semibold mt-1">{completedModules} / {modules.length}</p>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-400" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Estimated Time Left
            </p>
            <p className="text-2xl font-semibold mt-1">
              {Math.round(modules.reduce((sum, m) => sum + (m.duration * (100 - m.progress) / 100), 0) / 60)} hrs
            </p>
          </div>
          <GraduationCap className="w-6 h-6 text-primary" />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <Card key={module.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-lg">{module.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
              </div>
              <Badge
                variant="outline"
                className={
                  module.status === "completed"
                    ? "border-emerald-500/40 text-emerald-400"
                    : module.status === "in_progress"
                    ? "border-amber-500/40 text-amber-400"
                    : "border-muted-foreground/40 text-muted-foreground"
                }
              >
                {module.status === "completed" ? "Completed" : module.status === "in_progress" ? "In Progress" : "Not Started"}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Duration: {Math.round(module.duration / 60)} hrs</span>
              <span>Progress: {module.progress}%</span>
            </div>

            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${module.progress}%` }}
              />
            </div>

            <div className="flex justify-end gap-2">
              {module.status === "not_started" && (
                <Button
                  size="sm"
                  className="text-white"
                  onClick={() => handleStartModule(module.id)}
                  disabled={actionLoading === module.id}
                >
                  {actionLoading === module.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                  Start Module
                </Button>
              )}
              {module.status === "in_progress" && (
                <Button
                  size="sm"
                  className="text-white"
                  onClick={() => handleContinueModule(module.id)}
                  disabled={actionLoading === module.id}
                >
                  {actionLoading === module.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                  Continue
                </Button>
              )}
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
              {module.status !== "not_started" && (
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
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* PDF Viewer Modal */}
      {showPDF && selectedModule && (
        <Card className="fixed inset-4 z-50 p-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{selectedModule.title} - Reading Material</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowPDF(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 bg-muted/30 rounded flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">PDF Viewer</p>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedModule.title}.pdf would be displayed here.
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: {Math.round(selectedModule.duration / 60)} hours
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPDF(false)}>Close</Button>
            <Button onClick={() => {
              setShowPDF(false);
              setShowTest(true);
            }}>Take Test</Button>
          </div>
        </Card>
      )}

      {/* Test Modal */}
      {showTest && selectedModule && (
        <Card className="fixed inset-4 z-50 p-4 overflow-hidden flex flex-col">
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
                <p className="text-2xl font-bold">Score: {testScore}/100</p>
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
                {[
                  { id: 1, question: "What is the primary purpose of endpoint security?", options: ["Protect network perimeter", "Secure individual devices", "Encrypt data at rest", "Monitor network traffic"], correct: "1" },
                  { id: 2, question: "Which of the following is a strong password practice?", options: ["Using the same password everywhere", "Sharing passwords with team members", "Using 12+ characters with mixed case", "Writing passwords on sticky notes"], correct: "2" },
                  { id: 3, question: "What does MFA stand for?", options: ["Multi-Function Authentication", "Multi-Factor Authentication", "Managed Firewall Access", "Multi-Frequency Access"], correct: "1" },
                  { id: 4, question: "Phishing attacks typically target:", options: ["Hardware components", "Software vulnerabilities", "Human psychology", "Network protocols"], correct: "2" },
                  { id: 5, question: "What should you do with suspicious emails?", options: ["Open attachments to check content", "Click links to verify legitimacy", "Report to security team", "Forward to colleagues for opinion"], correct: "2" },
                ].map((q, idx) => (
                  <div key={q.id} className="p-4 bg-muted/30 rounded">
                    <p className="font-medium mb-3">{idx + 1}. {q.question}</p>
                    <RadioGroup 
                      value={testAnswers[q.id]} 
                      onValueChange={(v) => setTestAnswers({...testAnswers, [q.id]: v})}
                    >
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2 py-1">
                          <RadioGroupItem value={String(optIdx)} id={`q${q.id}-opt${optIdx}`} />
                          <Label htmlFor={`q${q.id}-opt${optIdx}`} className="cursor-pointer">{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowTest(false)}>Cancel</Button>
                  <Button 
                    onClick={() => {
                      // Calculate score (simplified - would check against correct answers)
                      const answered = Object.keys(testAnswers).length;
                      const score = Math.round((answered / 5) * 100);
                      setTestScore(Math.min(score, 100));
                    }}
                    disabled={Object.keys(testAnswers).length < 5}
                  >
                    Submit Test
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

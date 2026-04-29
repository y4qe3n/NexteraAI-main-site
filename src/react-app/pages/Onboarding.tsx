import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  Circle,
  ArrowRight,
  Rocket,
  Shield,
  Monitor,
  FileCheck,
  CreditCard,
  PhoneOff,
  GraduationCap,
  Lock,
} from "lucide-react";

type ChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
};

const iconMap: Record<string, any> = {
  account: Shield,
  org: Rocket,
  devices: Monitor,
  compliance: FileCheck,
  subscription: CreditCard,
  missed_call: PhoneOff,
  training: GraduationCap,
  mfa: Lock,
};

const linkMap: Record<string, string> = {
  account: "/dashboard/settings",
  org: "/dashboard/settings",
  devices: "/dashboard/endpoints",
  compliance: "/dashboard/compliance",
  subscription: "/dashboard/settings",
  missed_call: "/dashboard/missed-calls",
  training: "/dashboard/training",
  mfa: "/dashboard/settings",
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOnboarding();
  }, []);

  const fetchOnboarding = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/onboarding", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setChecklist(data.checklist || []);
        setProgress(data.progress || 0);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedCount = checklist.filter((i) => i.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" />
            Getting Started
          </h2>
          <p className="text-muted-foreground mt-1">
            Complete these steps to get the most out of NexteraAI Security.
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            progress === 100
              ? "border-emerald-500/40 text-emerald-400"
              : "border-primary/40 text-primary"
          }
        >
          {progress}% Complete
        </Badge>
      </div>

      {/* Progress bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            {completedCount} of {checklist.length} steps completed
          </span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {/* Checklist */}
      <div className="space-y-3">
        {checklist.map((item) => {
          const Icon = iconMap[item.id] || Circle;
          const link = linkMap[item.id] || "/dashboard";
          return (
            <Card
              key={item.id}
              className={`p-4 flex items-center justify-between transition-colors ${
                item.completed ? "opacity-70" : "hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.completed
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={
                    item.completed
                      ? "line-through text-muted-foreground"
                      : "font-medium"
                  }
                >
                  {item.label}
                </span>
              </div>
              {!item.completed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(link)}
                  className="text-primary"
                >
                  Go <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {progress === 100 && (
        <Card className="p-6 text-center bg-emerald-500/5 border-emerald-500/20">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-1">All set!</h3>
          <p className="text-muted-foreground text-sm mb-4">
            You've completed all onboarding steps. Your security platform is fully configured.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="text-white">
            Go to Dashboard
          </Button>
        </Card>
      )}
    </div>
  );
}

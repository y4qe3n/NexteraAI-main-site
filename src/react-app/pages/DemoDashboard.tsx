import { Link } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Clock,
  FileText,
} from "lucide-react";

const fakeDetections = [
  {
    id: 1,
    title: "Suspicious email attachment",
    severity: "High",
    status: "Under review",
    time: "2m ago",
  },
  {
    id: 2,
    title: "Brute-force login attempts",
    severity: "Critical",
    status: "Blocked",
    time: "10m ago",
  },
  {
    id: 3,
    title: "POPIA consent missing",
    severity: "Medium",
    status: "Remediation assigned",
    time: "30m ago",
  },
];

export function DemoDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Standalone preview</p>
          <h1 className="text-4xl font-bold">Demo Security Command Center</h1>
          <p className="text-muted-foreground">
            This sandbox view is isolated from the protected console and only showcases sample detections, a risk
            summary, and POPIA compliance messaging.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Return to home</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/login">Prototype login flow</Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 border border-white/10 bg-slate-900/70">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Security risk level</p>
                <h2 className="text-3xl font-semibold">Elevated</h2>
              </div>
              <ShieldAlert className="w-10 h-10 text-amber-400" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Automated detector flagged multiple anomalies in the last 24 hours. Review the detections list and assign
              remediation owners.
            </p>
            <div className="mt-6">
              <div className="h-2 w-full rounded-full bg-white/10">
                <div className="h-2 w-3/4 rounded-full bg-amber-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Risk score: 74 / 100</p>
            </div>
          </Card>

          <Card className="p-6 border border-white/10 bg-slate-900/70 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-green-300">POPIA compliance</p>
                <h3 className="text-xl font-semibold">Needs attention</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              The demo data shows a consent gap for the “Customer Feedback” form. Pair the compliance workflow with a
              consent capture change request to stay aligned with POPIA Condition 4.
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last audit: 6 days ago</span>
              <span>
                <Activity className="w-4 h-4 text-primary inline" /> Automated checks enabled
              </span>
            </div>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Recent demo detections</h2>
              <p className="text-sm text-muted-foreground">None of these are connected to your live environment.</p>
            </div>
            <span className="text-xs text-primary uppercase tracking-[0.3em]">Simulated</span>
          </div>
          <div className="space-y-3">
            {fakeDetections.map((detection) => (
              <Card key={detection.id} className="p-5 border border-white/10 bg-slate-900/80 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{detection.title}</h3>
                    <p className="text-xs text-muted-foreground">{detection.time}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] px-2 py-1">
                    {detection.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Severity: {detection.severity}</span>
                  <span className="flex items-center gap-1 text-[13px]">
                    <Clock className="w-4 h-4" /> Auto-created
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The detection is part of the demo stream and is unrelated to any customer data or deployments.
                </p>
              </Card>
            ))}
          </div>
        </section>

        <Card className="p-6 border border-white/10 bg-slate-900/70">
          <div className="flex items-center gap-4">
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Guidance</p>
              <p className="text-base text-muted-foreground">
                This view is purposely standalone. The real dashboard is protected behind authentication to prevent
                accidental exposure of sensitive data.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

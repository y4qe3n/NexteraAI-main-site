import { Card } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { PhoneOff } from "lucide-react";

export function MissedCallLogsPage() {
  return (
    <div className="mx-auto min-h-[70vh] w-full max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-300/15 bg-purple-300/10">
          <PhoneOff className="h-5 w-5 text-purple-200" />
        </span>
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-slate-50">Missed Call Follow-up</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
            Missed call management is moving to NexteraAI V2. We have kept the backend hooks so logs and
            automation continue to function, but the UI will return when the new workflow is ready.
          </p>
        </div>
      </div>

      <Card className="w-full overflow-hidden p-0 text-white">
        <div className="relative p-8 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(167,139,250,0.18),transparent_36%)]" />
          <div className="relative">
            <Badge className="mb-4 border-purple-300/20 bg-purple-300/10 text-[0.58rem] uppercase tracking-[0.34em] text-purple-100">
              V2 migration
            </Badge>
            <h3 className="text-lg font-semibold text-slate-50">Workflow temporarily parked</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              This page is intentionally marked as V2 instead of presenting a fake dashboard. Call logs and automation hooks remain intact while the new customer follow-up flow is rebuilt.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

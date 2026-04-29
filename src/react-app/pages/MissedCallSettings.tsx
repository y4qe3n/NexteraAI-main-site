import { Card } from "@/react-app/components/ui/card";
import { PhoneOff } from "lucide-react";

export function MissedCallSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <PhoneOff className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-white">Missed Call Follow-up</h2>
          <p className="text-sm text-muted-foreground">
            Missed call management is moving to NexteraAI V2. We’ve kept the backend hooks so logs and
            automation continue to work, but the settings UI will return in the next release.
          </p>
        </div>
      </div>
      <Card className="p-1 rounded-3xl bg-gradient-to-br from-primary/40 via-rose-500/30 to-secondary/40 shadow-xl shadow-primary/20">
        <div className="rounded-[28px] bg-sidebar p-8 border border-primary/30 shadow-inner">
          <p className="text-lg font-semibold text-white leading-relaxed tracking-wide">
            This experience has been temporarily removed from V1 while V2 finishes rolling out.
            Existing automations will keep working in the background, and the full logs/settings
            pages will come back once the new missed-call workflow is live. Stay tuned for the V2
            update.
          </p>
        </div>
      </Card>
    </div>
  );
}

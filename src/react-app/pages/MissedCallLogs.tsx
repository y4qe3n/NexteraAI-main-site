import { Card } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { PhoneOff } from "lucide-react";

export function MissedCallLogsPage() {
  return (
    <div className="space-y-6 max-w-4xl w-full mx-auto min-h-[70vh]">
      <div className="flex items-center gap-3">
        <PhoneOff className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-white">Missed Call Follow-up</h2>
          <p className="text-sm text-muted-foreground">
            Missed call management is moving to NexteraAI V2. We’ve kept the backend hooks so logs and
            automation continue to function, but the UI will return when the new workflow is ready.
          </p>
        </div>
      </div>
      <Card className="w-full p-10 bg-gradient-to-b from-indigo-900/90 via-primary/80 to-card/80 border border-primary/60 shadow-[0_35px_80px_-35px_rgba(15,23,42,0.9)] text-white">
        <p className="text-sm leading-relaxed">
          This feature has moved from V1 to V2. Stay tuned for the V2 update.
        </p>
        <Badge className="mt-4 bg-white text-primary text-[0.55rem] uppercase tracking-[0.4em]">V2 migration</Badge>
      </Card>
    </div>
  );
}

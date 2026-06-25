import { Bell, UserCheck, Users } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Progress } from "@/react-app/components/ui/progress";
import type { StaffTrainingProgress as StaffTrainingProgressRow } from "@/react-app/training/trainingTypes";

function formatDate(value: string | null) {
  if (!value) return "No activity";
  return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(new Date(value));
}

export function StaffTrainingProgress({
  staff,
  onAssign,
}: {
  staff: StaffTrainingProgressRow[];
  onAssign: () => void;
}) {
  if (staff.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#8B5CF6]/18 bg-[#0d0b12] p-8 text-center">
        <Users className="mx-auto h-8 w-8 text-[#C4B5FD]" />
        <h3 className="mt-4 text-lg font-semibold text-white">Invite staff to begin assigning security awareness training.</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#A89CC8]">
          Staff progress will appear once organisation members exist and training is assigned.
        </p>
        <Button className="mt-5 bg-[#6D28D9] text-white hover:bg-[#8B5CF6]" onClick={onAssign}>
          Assign training
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12]">
      <div className="grid grid-cols-[minmax(220px,1.4fr)_120px_130px_120px_160px] gap-4 border-b border-[#8B5CF6]/12 px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-[#8778AD] max-lg:hidden">
        <span>Staff member</span>
        <span>Assigned</span>
        <span>Completion</span>
        <span>Risk</span>
        <span>Actions</span>
      </div>
      <div className="divide-y divide-[#8B5CF6]/10">
        {staff.map((member) => (
          <div key={member.userId} className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(220px,1.4fr)_120px_130px_120px_160px] lg:items-center">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{member.name || member.email}</p>
              <p className="truncate text-xs text-[#8778AD]">{member.email}</p>
            </div>
            <div className="text-sm text-[#A89CC8]">{member.assignedModules}</div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-[#8f7dbf]">
                <span>{member.completionPercent}%</span>
                <span>{formatDate(member.lastActivityAt)}</span>
              </div>
              <Progress value={member.completionPercent} className="h-2 bg-white/6 [&>div]:bg-gradient-to-r [&>div]:from-[#6D28D9] [&>div]:to-[#C4B5FD]" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={
                  member.riskCategory === "High"
                    ? "border-rose-300/30 text-rose-200"
                    : member.riskCategory === "Medium"
                      ? "border-amber-300/30 text-amber-200"
                      : "border-emerald-300/30 text-emerald-200"
                }
              >
                {member.riskCategory}
              </Badge>
              {member.overdue && <Badge className="bg-rose-500/12 text-rose-100">Overdue</Badge>}
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" className="bg-[#6D28D9] text-white hover:bg-[#8B5CF6]" onClick={onAssign}>
                <UserCheck className="mr-2 h-4 w-4" />
                Assign
              </Button>
              <Button type="button" size="sm" variant="outline" className="border-[#8B5CF6]/16 bg-[#0b0910] text-[#E9D5FF]" title="Reminder backend not connected">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

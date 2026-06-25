import { useMemo, useState } from "react";
import { Calendar, Send, Users } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/react-app/components/ui/dialog";
import { Checkbox } from "@/react-app/components/ui/checkbox";
import { Input } from "@/react-app/components/ui/input";
import type { StaffTrainingProgress, TrainingModule } from "@/react-app/training/trainingTypes";

type TargetMode = "selected" | "all";

export function TrainingAssignmentModal({
  open,
  staff,
  modules,
  onClose,
  onAssign,
}: {
  open: boolean;
  staff: StaffTrainingProgress[];
  modules: TrainingModule[];
  onClose: () => void;
  onAssign: (input: { userIds: string[]; moduleIds: string[]; dueDate: string | null; reminderEnabled: boolean }) => Promise<void>;
}) {
  const [targetMode, setTargetMode] = useState<TargetMode>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>(["mod_phishing_basics"]);
  const [dueDate, setDueDate] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const userIds = useMemo(() => (targetMode === "all" ? staff.map((member) => member.userId) : selectedUsers), [selectedUsers, staff, targetMode]);
  const canAssign = selectedModules.length > 0 && (targetMode === "all" || selectedUsers.length > 0);

  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl border border-[#8B5CF6]/14 bg-[#0b0910] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Assign training</DialogTitle>
          <DialogDescription>
            Assign awareness modules to staff. Email reminders are only recorded here until a reminder backend is connected.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-[#C4B5FD]" />
              Staff
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(["all", "selected"] as TargetMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTargetMode(mode)}
                  className={`rounded-xl border px-3 py-2 text-sm capitalize transition ${
                    targetMode === mode ? "border-[#C4B5FD]/35 bg-[#8B5CF6]/18 text-white" : "border-[#8B5CF6]/12 bg-[#0b0910] text-[#A89CC8]"
                  }`}
                >
                  {mode === "all" ? "Whole organisation" : "Selected staff"}
                </button>
              ))}
            </div>
            {targetMode === "selected" && (
              <div className="mt-4 max-h-52 space-y-2 overflow-y-auto pr-1">
                {staff.length === 0 ? (
                  <p className="text-sm text-[#A89CC8]">No staff available yet.</p>
                ) : (
                  staff.map((member) => (
                    <label key={member.userId} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#8B5CF6]/12 bg-[#0b0910] p-3 text-sm">
                      <Checkbox checked={selectedUsers.includes(member.userId)} onCheckedChange={() => setSelectedUsers((current) => toggle(current, member.userId))} />
                      <span className="min-w-0">
                        <span className="block truncate text-white">{member.name}</span>
                        <span className="block truncate text-xs text-[#8778AD]">{member.email}</span>
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-4">
            <p className="text-sm font-semibold">Modules</p>
            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
              {modules.map((module) => (
                <label key={module.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#8B5CF6]/12 bg-[#0b0910] p-3 text-sm">
                  <Checkbox checked={selectedModules.includes(module.id)} onCheckedChange={() => setSelectedModules((current) => toggle(current, module.id))} />
                  <span>
                    <span className="block text-white">{module.title}</span>
                    <span className="block text-xs text-[#8778AD]">{module.estimatedMinutes} min · {module.difficulty}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-4 rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-2 flex items-center gap-2 text-[#E9D5FF]">
              <Calendar className="h-4 w-4 text-[#C4B5FD]" />
              Due date
            </span>
            <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="border-[#8B5CF6]/14 bg-[#09070d] text-white" />
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-[#8B5CF6]/12 bg-[#0b0910] p-3 text-sm text-[#A89CC8]">
            <Checkbox checked={reminderEnabled} onCheckedChange={(checked) => setReminderEnabled(Boolean(checked))} />
            Record optional reminder request
          </label>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="border-[#8B5CF6]/16 bg-[#0b0910] text-[#E9D5FF]" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canAssign || saving}
            className="bg-[#6D28D9] text-white hover:bg-[#8B5CF6]"
            onClick={async () => {
              setSaving(true);
              try {
                await onAssign({ userIds, moduleIds: selectedModules, dueDate: dueDate || null, reminderEnabled });
                onClose();
              } finally {
                setSaving(false);
              }
            }}
          >
            <Send className="mr-2 h-4 w-4" />
            Assign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

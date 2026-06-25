import { Download, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import type { TrainingReport } from "@/react-app/training/trainingTypes";

function metric(label: string, value: string | number, detail: string) {
  return (
    <div className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#8778AD]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#A89CC8]">{detail}</p>
    </div>
  );
}

export function TrainingReports({ report }: { report: TrainingReport }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {metric("Completion", `${report.completionRate}%`, "Organisation training completion rate.")}
        {metric("Assigned", report.totalAssigned, "Total active assignments.")}
        {metric("Overdue", report.overdueCount, "Lessons past due date.")}
        {metric("Quiz average", `${report.averageQuizScore}%`, "Average saved quiz result.")}
      </div>

      <section className="rounded-2xl border border-[#8B5CF6]/12 bg-[#0d0b12] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[#8778AD]">
              <TrendingUp className="h-4 w-4" />
              Reports
            </div>
            <h3 className="mt-2 text-lg font-semibold text-white">Training readiness summary</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A89CC8]">
              Export CSV is available for completion review. PDF generation is not shown because a PDF backend is not connected in this Worker.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="bg-[#6D28D9] text-white hover:bg-[#8B5CF6]">
              <a href="/api/training/reports/export.csv" download>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </a>
            </Button>
            <Button type="button" variant="outline" disabled className="border-[#8B5CF6]/16 bg-[#0b0910] text-[#A89CC8]">
              <FileText className="mr-2 h-4 w-4" />
              PDF unavailable
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

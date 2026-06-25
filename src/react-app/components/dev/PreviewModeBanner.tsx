import { getPreviewModeLabel, isDashboardPreviewMode } from "@/react-app/lib/preview/previewMode";

export function PreviewModeBanner() {
  if (!isDashboardPreviewMode()) return null;

  return (
    <div className="fixed bottom-3 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-amber-200/30 bg-[#1b1304]/95 px-4 py-2 text-xs font-semibold text-amber-100 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur">
      {getPreviewModeLabel()}
    </div>
  );
}

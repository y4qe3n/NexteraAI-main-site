const productionHostnames = new Set([
  "www.nexteraai.co.za",
  "nexteraai.co.za",
  "auth.nexteraai.co.za",
]);

export function getPreviewModeBlockReason(hostname = typeof window !== "undefined" ? window.location.hostname : "") {
  if (import.meta.env.PROD) return "production build";
  if (productionHostnames.has(hostname)) return `production hostname: ${hostname}`;
  return null;
}

export function isDashboardPreviewMode() {
  const blockReason = getPreviewModeBlockReason();
  const requested = import.meta.env.VITE_DASHBOARD_PREVIEW_MODE === "true";

  if (requested && blockReason) {
    if (import.meta.env.DEV) {
      console.warn(`Dashboard preview mode ignored on ${blockReason}.`);
    }
    return false;
  }

  return import.meta.env.DEV && requested;
}

export function getPreviewModeLabel() {
  return "Local Preview Mode - demo data only";
}

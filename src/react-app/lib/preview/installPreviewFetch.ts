import { demoBillingSummary, demoComplianceItems, demoDashboardStats, demoDevices, demoInvoices, demoAlerts, demoSubscription } from "./demoDashboardData";
import { demoOrganisation } from "./demoOrg";
import { demoSessionApiUser } from "./demoSession";
import { demoStaff, demoTrainingActivity, demoTrainingAssignments, demoTrainingProgress, demoTrainingReport, saveDemoTrainingProgress } from "./demoTrainingData";
import { isDashboardPreviewMode } from "./previewMode";
import { trainingModules } from "@/react-app/training/trainingContent";

let installed = false;

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

function csv(text: string, init: ResponseInit = {}) {
  return new Response(text, {
    ...init,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      ...init.headers,
    },
  });
}

function requestPath(input: RequestInfo | URL) {
  const raw = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  return new URL(raw, window.location.origin).pathname;
}

function requestMethod(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.method) return init.method.toUpperCase();
  if (input instanceof Request) return input.method.toUpperCase();
  return "GET";
}

async function readBody(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.body && typeof init.body === "string") {
    return JSON.parse(init.body) as Record<string, unknown>;
  }
  if (input instanceof Request) {
    return input.clone().json().catch(() => ({})) as Promise<Record<string, unknown>>;
  }
  return {};
}

export function installPreviewFetch() {
  if (installed || !isDashboardPreviewMode() || typeof window === "undefined") return;

  installed = true;
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const path = requestPath(input);
    const method = requestMethod(input, init);

    if (!path.startsWith("/api/")) {
      return realFetch(input, init);
    }

    if (method === "GET" && path === "/api/users/me") return json(demoSessionApiUser);
    if (method === "GET" && path === "/api/organization") return json(demoOrganisation);
    if (method === "GET" && path === "/api/dashboard/stats") return json(demoDashboardStats);

    if (method === "GET" && path === "/api/devices") return json(demoDevices);
    if (method === "POST" && path === "/api/devices") {
      const body = await readBody(input, init);
      const device = {
        id: 900 + demoDevices.length,
        name: String(body.name || "Demo Device"),
        device_type: typeof body.device_type === "string" ? body.device_type : "Laptop",
        os: typeof body.os === "string" ? body.os : "Windows 11",
        is_protected: 1,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      demoDevices.push(device);
      return json(device, { status: 201 });
    }
    if (method === "PATCH" && path.startsWith("/api/devices/")) {
      const id = Number(path.split("/").pop());
      const body = await readBody(input, init);
      const device = demoDevices.find((item) => item.id === id);
      if (!device) return json({ error: "Demo device not found" }, { status: 404 });
      if (typeof body.status === "string") device.status = body.status;
      device.updated_at = new Date().toISOString();
      return json(device);
    }

    if (method === "GET" && path === "/api/threats") return json(demoAlerts);
    if (method === "GET" && path === "/api/compliance") return json(demoComplianceItems);
    if (method === "PUT" && path.startsWith("/api/compliance/")) {
      const id = Number(path.split("/").pop());
      const body = await readBody(input, init);
      const item = demoComplianceItems.find((entry) => entry.id === id);
      if (!item) return json({ error: "Demo compliance item not found" }, { status: 404 });
      return json({ ...item, completion_status: body.status || item.completion_status });
    }

    if (method === "GET" && path === "/api/billing/summary") return json(demoBillingSummary);
    if (method === "GET" && path === "/api/billing/invoices") return json({ invoices: demoInvoices });
    if (method === "GET" && path === "/api/subscription") return json(demoSubscription);

    if (method === "GET" && path === "/api/training/modules") return json({ modules: trainingModules });
    if (method === "GET" && path.startsWith("/api/training/modules/")) {
      const slug = decodeURIComponent(path.split("/").pop() || "");
      const module = trainingModules.find((item) => item.slug === slug);
      return module ? json(module) : json({ error: "Module not found" }, { status: 404 });
    }
    if (method === "GET" && path === "/api/training/progress/me") {
      return json({ progress: demoTrainingProgress, assignments: demoTrainingAssignments, activity: demoTrainingActivity });
    }
    if (method === "POST" && path === "/api/training/progress") {
      const body = await readBody(input, init);
      const progress = saveDemoTrainingProgress({
        moduleId: String(body.moduleId || ""),
        lessonProgress: typeof body.lessonProgress === "object" && body.lessonProgress !== null ? body.lessonProgress as Record<string, boolean> : {},
        quizScore: typeof body.quizScore === "number" ? body.quizScore : null,
        status: typeof body.status === "string" ? body.status : "in_progress",
      });
      return json({ progress });
    }
    if (method === "GET" && path === "/api/training/org/progress") return json({ staff: demoStaff });
    if (method === "GET" && path === "/api/training/reports/summary") return json(demoTrainingReport);
    if (method === "POST" && path === "/api/training/assignments") {
      return json({ assignments: demoTrainingAssignments, message: "Local Preview Mode - assignment saved in demo memory only." }, { status: 201 });
    }
    if (method === "GET" && path === "/api/training/reports/export.csv") {
      return csv("module,assigned,completed,overdue\nPhishing Basics,4,3,0\nPassword Safety,4,2,1\nPOPIA Awareness,4,1,1\n");
    }

    return realFetch(input, init);
  };
}

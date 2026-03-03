import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Progress } from "@/react-app/components/ui/progress";
import { Checkbox } from "@/react-app/components/ui/checkbox";
import {
  FileCheck,
  CheckCircle,
  Circle,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type ComplianceItem = {
  id: number;
  category: string;
  title: string;
  description: string | null;
  requirement_level: string;
  sort_order: number;
  completion_status: "completed" | "in_progress" | "not_started";
  notes: string | null;
  completed_at: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  data_collection: "Data Collection",
  consent: "Consent Management",
  security: "Security Measures",
  rights: "Data Subject Rights",
  governance: "Governance & Policies",
};

function getCategoryIcon(category: string) {
  switch (category) {
    case "data_collection":
      return "📋";
    case "consent":
      return "✓";
    case "security":
      return "🔒";
    case "rights":
      return "⚖️";
    case "governance":
      return "📜";
    default:
      return "•";
  }
}

export function ComplianceHub() {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(CATEGORY_LABELS))
  );

  const fetchCompliance = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/compliance", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load compliance data");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
  }, []);

  const updateStatus = async (
    itemId: number,
    status: "completed" | "in_progress" | "not_started",
    notes?: string
  ) => {
    setUpdating(itemId);
    try {
      const res = await fetch(`/api/compliance/${itemId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await fetchCompliance();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const requiredItems = items.filter((i) => i.requirement_level === "required");
  const completedRequired = requiredItems.filter(
    (i) => i.completion_status === "completed"
  ).length;
  const totalRequired = requiredItems.length;
  const score =
    totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;

  const grouped = items.reduce<Record<string, ComplianceItem[]>>((acc, item) => {
    const cat = item.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-6 h-6" />
          <div>
            <p className="font-medium">Failed to load compliance data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button variant="outline" size="sm" className="text-white" onClick={fetchCompliance}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">POPIA Compliance Hub</h2>
        <p className="text-muted-foreground mt-1">
          Guided compliance tools with data mapping, consent tracking, and breach logging. Avoid R10M fines.
        </p>
      </div>

      {/* Score card */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <FileCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Compliance Score</p>
              <p className="text-4xl font-bold">{score}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {completedRequired} of {totalRequired} required items completed
              </p>
            </div>
          </div>
          <Progress value={score} className="w-full sm:w-48 h-3" />
        </div>
      </Card>

      {/* Checklist */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Compliance Checklist</h3>
          <p className="text-sm text-muted-foreground">
            Mark items as completed as you implement each requirement
          </p>
        </div>
        <div className="divide-y divide-border">
          {Object.entries(grouped).map(([category, categoryItems]) => {
            const label = CATEGORY_LABELS[category] || category;
            const isExpanded = expandedCategories.has(category);
            const catCompleted = categoryItems.filter(
              (i) => i.completion_status === "completed"
            ).length;
            const catTotal = categoryItems.length;

            return (
              <div key={category}>
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <span className="font-medium flex-1">{label}</span>
                  <Badge variant="outline" className="text-xs">
                    {catCompleted}/{catTotal}
                  </Badge>
                </button>
                {isExpanded && (
                  <div className="pl-4 pr-4 pb-4 space-y-3">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-3 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <div className="pt-1">
                          {updating === item.id ? (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          ) : (
                            <Checkbox
                              checked={item.completion_status === "completed"}
                              onCheckedChange={(checked) =>
                                updateStatus(
                                  item.id,
                                  checked ? "completed" : "not_started"
                                )
                              }
                              disabled={updating !== null && updating !== item.id}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.title}</span>
                            {item.requirement_level === "recommended" && (
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant={
                                item.completion_status === "completed"
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="text-white"
                              onClick={() =>
                                updateStatus(item.id, "completed")
                              }
                              disabled={updating === item.id}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Done
                            </Button>
                            <Button
                              variant={
                                item.completion_status === "in_progress"
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="text-white"
                              onClick={() =>
                                updateStatus(item.id, "in_progress")
                              }
                              disabled={updating === item.id}
                            >
                              <Circle className="w-4 h-4 mr-1" />
                              In Progress
                            </Button>
                            {item.completion_status !== "not_started" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white"
                                onClick={() =>
                                  updateStatus(item.id, "not_started")
                                }
                                disabled={updating === item.id}
                              >
                                Reset
                              </Button>
                            )}
                          </div>
                        </div>
                        {item.completion_status === "completed" && (
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

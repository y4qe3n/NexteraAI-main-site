import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/react-app/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/react-app/components/ui/table";
import { Badge } from "@/react-app/components/ui/badge";
import { Loader2, MailWarning, ShieldCheck, Trash2, Plus, X, Ban, CheckCircle } from "lucide-react";

type EmailScan = {
  id: number;
  sender: string | null;
  subject: string | null;
  reason: string | null;
  scanned_at: string;
  threat_detected: number;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export function EmailGuardPage() {
  const [scans, setScans] = useState<EmailScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showBlockList, setShowBlockList] = useState(false);
  const [blockList, setBlockList] = useState<string[]>(["spam@example.com", "phishing@malicious.com"]);
  const [allowList, setAllowList] = useState<string[]>(["trusted@company.com", "ceo@company.com"]);
  const [newEntry, setNewEntry] = useState("");

  useEffect(() => {
    const fetchScans = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/email-scans?limit=100", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load email scans");
        const data = await res.json();
        setScans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  const processedToday = scans.length;
  const phishingBlocked = scans.filter((s) => s.reason === "phishing").length;
  const maliciousAttachments = scans.filter(
    (s) => s.reason === "malware" || s.reason === "attachment"
  ).length;
  const quarantined = scans.filter((s) => s.threat_detected === 1).length;

  const handleRelease = async (scanId: number) => {
    try {
      setActionLoading(scanId);
      // Placeholder for actual API endpoint once implemented
      const res = await fetch(`/api/email-scans/${scanId}/release`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to release email");
      setScans(scans.filter(s => s.id !== scanId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to release email");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (scanId: number) => {
    try {
      setActionLoading(scanId);
      // Placeholder for actual API endpoint once implemented
      const res = await fetch(`/api/email-scans/${scanId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete email");
      setScans(scans.filter(s => s.id !== scanId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete email");
    } finally {
      setActionLoading(null);
    }
  };

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
          <MailWarning className="w-6 h-6" />
          <div>
            <p className="font-medium">Failed to load email scans</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Email Guard</h2>
          <p className="text-sm text-muted-foreground">
            Email security overview and quarantine management.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-white"
            onClick={() => setShowBlockList(!showBlockList)}
          >
            <Ban className="w-4 h-4 mr-2" />
            Manage Allow/Block Lists
          </Button>
        </div>
      </div>

      {showBlockList && (
        <Card className="p-4 border border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Manage Email Lists</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowBlockList(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <Tabs defaultValue="block" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="block">
                <Ban className="w-4 h-4 mr-2" />
                Block List ({blockList.length})
              </TabsTrigger>
              <TabsTrigger value="allow">
                <CheckCircle className="w-4 h-4 mr-2" />
                Allow List ({allowList.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="block" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email or domain to block..."
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                />
                <Button 
                  onClick={() => {
                    if (newEntry && !blockList.includes(newEntry)) {
                      setBlockList([...blockList, newEntry]);
                      setNewEntry("");
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {blockList.map((entry) => (
                  <div key={entry} className="flex items-center justify-between p-2 bg-red-500/10 rounded border border-red-500/20">
                    <span className="text-sm">{entry}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setBlockList(blockList.filter(e => e !== entry))}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="allow" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email or domain to allow..."
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                />
                <Button 
                  onClick={() => {
                    if (newEntry && !allowList.includes(newEntry)) {
                      setAllowList([...allowList, newEntry]);
                      setNewEntry("");
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allowList.map((entry) => (
                  <div key={entry} className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                    <span className="text-sm">{entry}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setAllowList(allowList.filter(e => e !== entry))}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Emails Processed
          </p>
          <p className="text-2xl font-semibold mt-1">{processedToday}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Phishing Blocked
          </p>
          <p className="text-2xl font-semibold mt-1">{phishingBlocked}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Malicious Attachments
          </p>
          <p className="text-2xl font-semibold mt-1">{maliciousAttachments}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Quarantine Queue
          </p>
          <p className="text-2xl font-semibold mt-1">{quarantined}</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Quarantine</h3>
            <p className="text-sm text-muted-foreground">
              Suspicious emails held for review.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No quarantined emails yet.
                  </TableCell>
                </TableRow>
              ) : (
                scans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell>{scan.sender || "Unknown"}</TableCell>
                    <TableCell>{scan.subject || "(no subject)"}</TableCell>
                    <TableCell>
                      {scan.threat_detected ? (
                        <Badge
                          variant="outline"
                          className="border-amber-500/40 text-amber-400 gap-1"
                        >
                          <MailWarning className="w-3 h-3" />
                          {scan.reason || "Threat detected"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Clean
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(scan.scanned_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white"
                          onClick={() => handleRelease(scan.id)}
                          disabled={actionLoading === scan.id}
                        >
                          {actionLoading === scan.id ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : null}
                          Release
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white"
                          onClick={() => handleDelete(scan.id)}
                          disabled={actionLoading === scan.id}
                        >
                          {actionLoading === scan.id ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : null}
                          Delete
                          <Trash2 className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

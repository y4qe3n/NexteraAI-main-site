import type { ThreatDetectorInput, AIDetectionResult, Severity } from "./types";

// Known malicious IP ranges (simulated threat intelligence feed)
const MALICIOUS_IP_PREFIXES = [
  "185.220.", "23.129.", "171.25.", "198.98.", "45.154.", "91.219.",
  "104.244.", "209.141.", "199.195.", "162.247.", "178.20.", "5.2.",
];

// Known malicious ports
const SUSPICIOUS_PORTS = new Set([
  4444, 5555, 6666, 6667, 8443, 9001, 9050, 9150, 31337, 12345,
  1337, 7777, 3389, 5900, 2222, 8888, 4443, 6660, 6669,
]);

// Common attack signatures in payloads
const ATTACK_SIGNATURES = [
  { pattern: /(\.\.\/)+(etc\/passwd|windows\/system32)/i, name: "Path Traversal", weight: 90 },
  { pattern: /<script[^>]*>.*<\/script>/i, name: "XSS Injection", weight: 85 },
  { pattern: /('|"|;)\s*(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR\s+1\s*=\s*1)/i, name: "SQL Injection", weight: 95 },
  { pattern: /\b(cmd\.exe|\/bin\/(sh|bash)|powershell|wget|curl)\b.*\|/i, name: "Command Injection", weight: 92 },
  { pattern: /\b(nmap|masscan|nikto|sqlmap|metasploit|hydra|gobuster)\b/i, name: "Recon Tool Detected", weight: 75 },
  { pattern: /\b(ransomware|encrypt|bitcoin|monero|wallet|decrypt)\b/i, name: "Ransomware Indicator", weight: 88 },
  { pattern: /base64_decode|eval\(|exec\(|system\(/i, name: "Code Execution Attempt", weight: 80 },
  { pattern: /\b(brute.?force|dictionary.?attack|credential.?stuff)/i, name: "Brute Force Indicator", weight: 70 },
  { pattern: /\.(exe|bat|ps1|vbs|scr|dll|msi)\b/i, name: "Suspicious File Extension", weight: 60 },
  { pattern: /\b(reverse.?shell|bind.?shell|meterpreter|c2|beacon)\b/i, name: "C2 Communication", weight: 95 },
];

// Event type risk multipliers
const EVENT_RISK_MULTIPLIERS: Record<string, number> = {
  login: 1.0,
  network: 1.2,
  file: 1.1,
  process: 1.3,
  dns: 0.9,
  firewall: 1.4,
};

function isPrivateIp(ip: string): boolean {
  return (
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") || ip.startsWith("172.17.") || ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") || ip.startsWith("172.2") || ip.startsWith("172.30.") ||
    ip.startsWith("172.31.") ||
    ip.startsWith("192.168.") ||
    ip === "127.0.0.1" || ip === "::1"
  );
}

function checkIpReputation(ip: string): number {
  if (!ip) return 0;
  for (const prefix of MALICIOUS_IP_PREFIXES) {
    if (ip.startsWith(prefix)) return 40;
  }
  // External IPs get a small baseline score
  if (!isPrivateIp(ip)) return 5;
  return 0;
}

function checkPort(port: number | undefined): number {
  if (!port) return 0;
  if (SUSPICIOUS_PORTS.has(port)) return 25;
  if (port > 49151) return 10; // ephemeral high ports
  return 0;
}

function checkPayload(payload: string | undefined): { score: number; matches: string[] } {
  if (!payload) return { score: 0, matches: [] };
  let score = 0;
  const matches: string[] = [];
  for (const sig of ATTACK_SIGNATURES) {
    if (sig.pattern.test(payload)) {
      score = Math.max(score, sig.weight);
      matches.push(sig.name);
    }
  }
  return { score, matches };
}

function checkProtocol(protocol: string | undefined): number {
  if (!protocol) return 0;
  const p = protocol.toLowerCase();
  // Uncommon or suspicious protocols
  if (["telnet", "ftp", "tftp", "rsh", "rlogin"].includes(p)) return 15;
  if (p === "icmp") return 5; // ping sweep indicator
  return 0;
}

function deriveSeverity(score: number): Severity {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "medium";
  if (score >= 20) return "low";
  return "info";
}

function deriveAction(severity: Severity, matches: string[]): string {
  switch (severity) {
    case "critical":
      return `BLOCK immediately. Isolate affected systems. Investigate: ${matches.join(", ")}`;
    case "high":
      return `Alert SOC team. Review and consider blocking source. Detected: ${matches.join(", ")}`;
    case "medium":
      return `Monitor closely. Add to watchlist. Flagged: ${matches.join(", ") || "suspicious activity"}`;
    case "low":
      return "Log for review. No immediate action required.";
    default:
      return "No action needed. Normal activity.";
  }
}

export function detectThreat(input: ThreatDetectorInput): AIDetectionResult {
  let totalScore = 0;
  const findings: string[] = [];

  // 1. IP reputation
  const srcIpScore = checkIpReputation(input.sourceIp || "");
  if (srcIpScore > 0) findings.push(`Source IP ${input.sourceIp} flagged (score: ${srcIpScore})`);
  totalScore += srcIpScore;

  const dstIpScore = checkIpReputation(input.destinationIp || "");
  if (dstIpScore > 0) findings.push(`Destination IP ${input.destinationIp} flagged`);
  totalScore += dstIpScore;

  // 2. Port analysis
  const portScore = checkPort(input.port);
  if (portScore > 0) findings.push(`Suspicious port ${input.port}`);
  totalScore += portScore;

  // 3. Payload/signature analysis
  const { score: payloadScore, matches } = checkPayload(input.payload);
  if (payloadScore > 0) findings.push(...matches);
  totalScore += payloadScore;

  // 4. Protocol check
  const protoScore = checkProtocol(input.protocol);
  if (protoScore > 0) findings.push(`Risky protocol: ${input.protocol}`);
  totalScore += protoScore;

  // 5. Apply event type multiplier
  const multiplier = EVENT_RISK_MULTIPLIERS[input.eventType] || 1.0;
  totalScore = Math.min(100, Math.round(totalScore * multiplier));

  const severity = deriveSeverity(totalScore);
  const isThreat = totalScore >= 40;
  const action = deriveAction(severity, findings);

  const title = isThreat
    ? `${severity.toUpperCase()} threat detected: ${findings[0] || input.eventType + " event"}`
    : `Normal ${input.eventType} event`;

  const description = findings.length > 0
    ? `AI Threat Detector analyzed ${input.eventType} event and found ${findings.length} indicator(s): ${findings.join("; ")}`
    : `AI Threat Detector analyzed ${input.eventType} event. No threat indicators found.`;

  return {
    module: "threat_detector",
    severity,
    riskScore: totalScore,
    isThreat,
    title,
    description,
    action,
    sourceType: input.eventType,
    sourceId: input.sourceIp || input.deviceId || undefined,
    rawInput: JSON.stringify(input),
    rawOutput: JSON.stringify({ totalScore, findings, multiplier }),
  };
}

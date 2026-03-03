import type { PhishingClassifierInput, AIDetectionResult, Severity } from "./types";

// Phishing keyword dictionaries with weights
const SUBJECT_KEYWORDS: Array<{ pattern: RegExp; weight: number; label: string }> = [
  { pattern: /urgent|immediate\s+action|act\s+now|limited\s+time/i, weight: 20, label: "Urgency language" },
  { pattern: /verify\s+your\s+(account|identity|email|password)/i, weight: 25, label: "Account verification lure" },
  { pattern: /suspended|locked|disabled|restricted/i, weight: 22, label: "Account threat language" },
  { pattern: /click\s+here|click\s+below|click\s+the\s+link/i, weight: 15, label: "Click bait" },
  { pattern: /winner|won|lottery|prize|congratulations/i, weight: 30, label: "Prize scam" },
  { pattern: /invoice|payment\s+(due|required|overdue)|billing/i, weight: 18, label: "Payment pressure" },
  { pattern: /password\s+(reset|expire|change)|credentials/i, weight: 22, label: "Credential harvesting" },
  { pattern: /bank|paypal|apple\s+id|microsoft\s+account/i, weight: 20, label: "Brand impersonation" },
  { pattern: /security\s+(alert|warning|notice|update)/i, weight: 18, label: "Fake security alert" },
  { pattern: /free|gift\s+card|reward|offer\s+expires/i, weight: 15, label: "Free offer lure" },
];

const BODY_KEYWORDS: Array<{ pattern: RegExp; weight: number; label: string }> = [
  { pattern: /dear\s+(customer|user|valued\s+member|sir|madam)/i, weight: 12, label: "Generic greeting" },
  { pattern: /we\s+have\s+(detected|noticed|found)\s+(unusual|suspicious)/i, weight: 20, label: "Fake detection claim" },
  { pattern: /confirm\s+your\s+(identity|details|information)/i, weight: 18, label: "Info harvesting" },
  { pattern: /failure\s+to\s+(comply|respond|verify)/i, weight: 20, label: "Threat language" },
  { pattern: /within\s+\d+\s+(hours?|days?|minutes?)/i, weight: 15, label: "Time pressure" },
  { pattern: /do\s+not\s+(ignore|disregard)\s+this/i, weight: 15, label: "Urgency amplifier" },
  { pattern: /unsubscribe|opt.?out/i, weight: -5, label: "Legitimate footer (negative)" },
  { pattern: /social\s+security|ssn|tax\s+id|id\s+number/i, weight: 25, label: "PII request" },
];

// Suspicious sender patterns
const SENDER_PATTERNS: Array<{ pattern: RegExp; weight: number; label: string }> = [
  { pattern: /noreply@.*\.(ru|cn|tk|ml|ga|cf|gq|xyz|top|buzz)/i, weight: 25, label: "Suspicious TLD" },
  { pattern: /@(gmail|yahoo|hotmail|outlook)\.\w+$/i, weight: 8, label: "Free email provider (business context)" },
  { pattern: /[0-9]{5,}@/i, weight: 15, label: "Numeric sender prefix" },
  { pattern: /(support|admin|security|help)@(?!microsoft|google|apple|amazon)/i, weight: 10, label: "Impersonating support" },
  { pattern: /(.)\1{3,}/i, weight: 10, label: "Repeated characters in address" },
];

// Suspicious URL patterns
const URL_PATTERNS: Array<{ pattern: RegExp; weight: number; label: string }> = [
  { pattern: /bit\.ly|tinyurl|t\.co|goo\.gl|rb\.gy|is\.gd/i, weight: 12, label: "URL shortener" },
  { pattern: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i, weight: 20, label: "IP-based URL" },
  { pattern: /login|signin|verify|secure|account|update/i, weight: 15, label: "Credential page URL" },
  { pattern: /\.(ru|cn|tk|ml|ga|cf|gq|xyz|top|buzz)/i, weight: 18, label: "Suspicious domain TLD" },
  { pattern: /@/i, weight: 20, label: "@ symbol in URL (redirect trick)" },
  { pattern: /https?:\/\/[^/]*-[^/]*-[^/]*\./i, weight: 12, label: "Multi-hyphen domain" },
];

// Header analysis
function analyzeHeaders(headers: Record<string, string> | undefined): { score: number; findings: string[] } {
  if (!headers) return { score: 0, findings: [] };
  let score = 0;
  const findings: string[] = [];

  // SPF fail
  const received = Object.entries(headers).find(([k]) => k.toLowerCase().includes("authentication"));
  if (received) {
    const val = String(received[1]).toLowerCase();
    if (val.includes("spf=fail") || val.includes("spf=softfail")) {
      score += 20;
      findings.push("SPF authentication failed");
    }
    if (val.includes("dkim=fail")) {
      score += 20;
      findings.push("DKIM authentication failed");
    }
    if (val.includes("dmarc=fail")) {
      score += 15;
      findings.push("DMARC policy failed");
    }
  }

  // Reply-To mismatch
  const replyTo = headers["reply-to"] || headers["Reply-To"] || "";
  const from = headers["from"] || headers["From"] || "";
  if (replyTo && from && !replyTo.includes(from.split("@")[1] || "___")) {
    score += 15;
    findings.push("Reply-To domain differs from sender");
  }

  return { score, findings };
}

function analyzeAttachments(hasAttachment: boolean | undefined, types: string[] | undefined): { score: number; findings: string[] } {
  if (!hasAttachment || !types?.length) return { score: 0, findings: [] };
  let score = 0;
  const findings: string[] = [];

  const dangerousExts = [".exe", ".bat", ".ps1", ".vbs", ".scr", ".js", ".hta", ".cmd", ".msi", ".dll"];
  const suspiciousExts = [".zip", ".rar", ".7z", ".iso", ".img", ".docm", ".xlsm", ".pptm"];

  for (const t of types) {
    const ext = t.toLowerCase();
    if (dangerousExts.some((d) => ext.includes(d))) {
      score += 30;
      findings.push(`Dangerous attachment type: ${t}`);
    } else if (suspiciousExts.some((s) => ext.includes(s))) {
      score += 15;
      findings.push(`Suspicious attachment type: ${t}`);
    }
  }

  return { score, findings };
}

function matchPatterns(text: string, patterns: Array<{ pattern: RegExp; weight: number; label: string }>): { score: number; findings: string[] } {
  let score = 0;
  const findings: string[] = [];
  for (const p of patterns) {
    if (p.pattern.test(text)) {
      score += p.weight;
      findings.push(p.label);
    }
  }
  return { score, findings };
}

function deriveSeverity(score: number): Severity {
  if (score >= 70) return "critical";
  if (score >= 50) return "high";
  if (score >= 30) return "medium";
  if (score >= 15) return "low";
  return "info";
}

function deriveDecision(score: number): string {
  if (score >= 60) return "BLOCK";
  if (score >= 35) return "QUARANTINE";
  return "ALLOW";
}

export function classifyPhishing(input: PhishingClassifierInput): AIDetectionResult {
  const allFindings: string[] = [];
  let totalScore = 0;

  // 1. Subject analysis
  const subjectResult = matchPatterns(input.subject, SUBJECT_KEYWORDS);
  totalScore += subjectResult.score;
  allFindings.push(...subjectResult.findings);

  // 2. Body analysis
  const bodyResult = matchPatterns(input.bodyPreview, BODY_KEYWORDS);
  totalScore += bodyResult.score;
  allFindings.push(...bodyResult.findings);

  // 3. Sender analysis
  const senderResult = matchPatterns(input.from, SENDER_PATTERNS);
  totalScore += senderResult.score;
  allFindings.push(...senderResult.findings);

  // 4. URL analysis
  if (input.urls?.length) {
    for (const url of input.urls) {
      const urlResult = matchPatterns(url, URL_PATTERNS);
      totalScore += urlResult.score;
      allFindings.push(...urlResult.findings);
    }
  }

  // 5. Header analysis
  const headerResult = analyzeHeaders(input.headers);
  totalScore += headerResult.score;
  allFindings.push(...headerResult.findings);

  // 6. Attachment analysis
  const attachResult = analyzeAttachments(input.hasAttachment, input.attachmentTypes);
  totalScore += attachResult.score;
  allFindings.push(...attachResult.findings);

  // Clamp
  totalScore = Math.min(100, Math.max(0, totalScore));

  const severity = deriveSeverity(totalScore);
  const isThreat = totalScore >= 30;
  const decision = deriveDecision(totalScore);
  const probability = Math.min(1, totalScore / 100);

  return {
    module: "phishing_classifier",
    severity,
    riskScore: totalScore,
    isThreat,
    title: isThreat
      ? `Phishing email detected (${decision}): "${input.subject.slice(0, 60)}"`
      : `Email classified as safe: "${input.subject.slice(0, 60)}"`,
    description: allFindings.length > 0
      ? `Phishing probability: ${(probability * 100).toFixed(0)}%. Decision: ${decision}. Indicators: ${allFindings.join("; ")}`
      : `Email appears legitimate. Phishing probability: ${(probability * 100).toFixed(0)}%`,
    action: decision === "BLOCK"
      ? "Block delivery. Alert user about phishing attempt. Report to abuse."
      : decision === "QUARANTINE"
        ? "Move to quarantine folder. Notify user to verify sender."
        : "Deliver normally. No action required.",
    sourceType: "email",
    sourceId: input.from,
    rawInput: JSON.stringify(input),
    rawOutput: JSON.stringify({ totalScore, probability, decision, findings: allFindings }),
  };
}

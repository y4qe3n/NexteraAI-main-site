import type { LoginAnomalyInput, AIDetectionResult, Severity } from "./types";

// Known Tor exit node prefixes and VPN/proxy indicators
const TOR_EXIT_PREFIXES = [
  "185.220.", "23.129.", "171.25.", "198.98.", "45.154.", "104.244.", "209.141.",
];

const VPN_INDICATORS = [
  "mullvad", "nordvpn", "expressvpn", "protonvpn", "surfshark", "cyberghost",
];

// Suspicious user-agent patterns
const SUSPICIOUS_UA_PATTERNS = [
  /python-requests/i,
  /curl\//i,
  /wget\//i,
  /scrapy/i,
  /bot|crawler|spider/i,
  /headless/i,
  /phantom/i,
  /selenium/i,
];

// High-risk countries (for a South African business context)
const HIGH_RISK_COUNTRIES = new Set([
  "RU", "CN", "KP", "IR", "NG", "RO", "UA", "BY", "VN", "PK",
]);

// Business hours for South Africa (SAST = UTC+2)
const BUSINESS_HOUR_START = 6; // 6 AM
const BUSINESS_HOUR_END = 22; // 10 PM

function parseHour(timestamp: string): number {
  try {
    const d = new Date(timestamp);
    // Return UTC hour + 2 for SAST
    return (d.getUTCHours() + 2) % 24;
  } catch {
    return 12; // default to midday if unparseable
  }
}

function checkTimeAnomaly(timestamp: string): { score: number; finding: string | null } {
  const hour = parseHour(timestamp);
  if (hour >= 1 && hour <= 4) {
    return { score: 20, finding: `Login at unusual hour (${hour}:00 SAST)` };
  }
  if (hour < BUSINESS_HOUR_START || hour > BUSINESS_HOUR_END) {
    return { score: 10, finding: `Login outside business hours (${hour}:00 SAST)` };
  }
  return { score: 0, finding: null };
}

function checkIpAnomaly(ip: string, history: LoginAnomalyInput["loginHistory"]): { score: number; findings: string[] } {
  let score = 0;
  const findings: string[] = [];

  // Tor exit node check
  for (const prefix of TOR_EXIT_PREFIXES) {
    if (ip.startsWith(prefix)) {
      score += 30;
      findings.push("Login from known Tor exit node");
      break;
    }
  }

  // Check if IP is new compared to history
  if (history && history.length > 0) {
    const knownIps = new Set(history.map((h) => h.ip));
    if (!knownIps.has(ip)) {
      score += 15;
      findings.push(`New IP address not seen in login history (${ip})`);
    }

    // Rapid IP change: different IP within last 30 minutes
    const thirtyMinAgo = Date.now() - 30 * 60 * 1000;
    const recentLogins = history.filter((h) => new Date(h.timestamp).getTime() > thirtyMinAgo);
    const recentIps = new Set(recentLogins.map((h) => h.ip));
    if (recentIps.size > 0 && !recentIps.has(ip)) {
      score += 20;
      findings.push("IP changed within 30 minutes (impossible travel indicator)");
    }
  }

  return { score, findings };
}

function checkUserAgentAnomaly(ua: string, history: LoginAnomalyInput["loginHistory"]): { score: number; findings: string[] } {
  let score = 0;
  const findings: string[] = [];

  // Suspicious UA patterns
  for (const pattern of SUSPICIOUS_UA_PATTERNS) {
    if (pattern.test(ua)) {
      score += 25;
      findings.push(`Automated/suspicious user agent: ${ua.slice(0, 50)}`);
      break;
    }
  }

  // Empty user agent
  if (!ua || ua.length < 10) {
    score += 15;
    findings.push("Missing or minimal user agent string");
  }

  // VPN indicator in UA
  for (const vpn of VPN_INDICATORS) {
    if (ua.toLowerCase().includes(vpn)) {
      score += 10;
      findings.push("VPN software detected in user agent");
      break;
    }
  }

  // New UA compared to history
  if (history && history.length > 0) {
    const knownUAs = new Set(history.map((h) => h.userAgent));
    if (!knownUAs.has(ua) && !findings.length) {
      score += 8;
      findings.push("New device/browser not seen in login history");
    }
  }

  return { score, findings };
}

function checkCountryAnomaly(country: string | undefined): { score: number; finding: string | null } {
  if (!country) return { score: 5, finding: "Country could not be determined" };
  if (HIGH_RISK_COUNTRIES.has(country.toUpperCase())) {
    return { score: 25, finding: `Login from high-risk country: ${country}` };
  }
  return { score: 0, finding: null };
}

function checkFailurePattern(history: LoginAnomalyInput["loginHistory"]): { score: number; finding: string | null } {
  if (!history || history.length < 3) return { score: 0, finding: null };

  // Count recent failures (last hour)
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const recentFailures = history.filter(
    (h) => !h.success && new Date(h.timestamp).getTime() > oneHourAgo
  ).length;

  if (recentFailures >= 5) {
    return { score: 30, finding: `${recentFailures} failed login attempts in the last hour (brute force indicator)` };
  }
  if (recentFailures >= 3) {
    return { score: 15, finding: `${recentFailures} failed login attempts in the last hour` };
  }
  return { score: 0, finding: null };
}

function deriveSeverity(score: number): Severity {
  if (score >= 70) return "critical";
  if (score >= 50) return "high";
  if (score >= 30) return "medium";
  if (score >= 15) return "low";
  return "info";
}

export function detectLoginAnomaly(input: LoginAnomalyInput): AIDetectionResult {
  const allFindings: string[] = [];
  let totalScore = 0;

  // 1. Time anomaly
  const timeResult = checkTimeAnomaly(input.timestamp);
  totalScore += timeResult.score;
  if (timeResult.finding) allFindings.push(timeResult.finding);

  // 2. IP anomaly
  const ipResult = checkIpAnomaly(input.ip, input.loginHistory);
  totalScore += ipResult.score;
  allFindings.push(...ipResult.findings);

  // 3. User agent anomaly
  const uaResult = checkUserAgentAnomaly(input.userAgent, input.loginHistory);
  totalScore += uaResult.score;
  allFindings.push(...uaResult.findings);

  // 4. Country anomaly
  const countryResult = checkCountryAnomaly(input.country);
  totalScore += countryResult.score;
  if (countryResult.finding) allFindings.push(countryResult.finding);

  // 5. Failure pattern
  const failureResult = checkFailurePattern(input.loginHistory);
  totalScore += failureResult.score;
  if (failureResult.finding) allFindings.push(failureResult.finding);

  // Clamp
  totalScore = Math.min(100, Math.max(0, totalScore));

  const severity = deriveSeverity(totalScore);
  const isThreat = totalScore >= 30;

  return {
    module: "login_anomaly",
    severity,
    riskScore: totalScore,
    isThreat,
    title: isThreat
      ? `Suspicious login detected for ${input.email}`
      : `Normal login for ${input.email}`,
    description: allFindings.length > 0
      ? `Login anomaly score: ${totalScore}/100. Indicators: ${allFindings.join("; ")}`
      : `Login appears normal. Anomaly score: ${totalScore}/100`,
    action: severity === "critical"
      ? "BLOCK login immediately. Force password reset. Notify account owner."
      : severity === "high"
        ? "Require MFA verification. Alert security team."
        : severity === "medium"
          ? "Flag for review. Send login notification to user."
          : "No action required.",
    sourceType: "login",
    sourceId: input.userId,
    rawInput: JSON.stringify(input),
    rawOutput: JSON.stringify({ totalScore, findings: allFindings }),
  };
}

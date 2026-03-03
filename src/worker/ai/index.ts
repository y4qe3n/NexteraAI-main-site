// Central AI engine: exports all modules + persistence helper

export { detectThreat } from "./threat-detector";
export { classifyPhishing } from "./phishing-classifier";
export { detectLoginAnomaly } from "./login-anomaly";
export { generateMissedCallReplies } from "./missed-call-reply";
export { checkPOPIACompliance } from "./popia-checker";
export type {
  AIModuleName,
  Severity,
  DetectionStatus,
  AIDetectionResult,
  ThreatDetectorInput,
  PhishingClassifierInput,
  LoginAnomalyInput,
  MissedCallReplyInput,
  MissedCallReplyResult,
  POPIACheckInput,
  POPIACheckResult,
} from "./types";

import type { AIDetectionResult } from "./types";

/**
 * Persist an AI detection result to D1.
 * Call this after running any AI module to store the result.
 */
export async function saveDetection(
  db: D1Database,
  organizationId: number,
  result: AIDetectionResult
): Promise<number> {
  const stmt = db.prepare(
    `INSERT INTO ai_detections
       (organization_id, module, severity, risk_score, is_threat, title, description, action, source_type, source_id, raw_input, raw_output, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`
  ).bind(
    organizationId,
    result.module,
    result.severity,
    result.riskScore,
    result.isThreat ? 1 : 0,
    result.title,
    result.description,
    result.action,
    result.sourceType || null,
    result.sourceId || null,
    result.rawInput || null,
    result.rawOutput || null
  );
  const res = await stmt.run();
  return res.meta.last_row_id as number;
}

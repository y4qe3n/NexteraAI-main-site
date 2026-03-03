// Shared types for all AI modules

export type AIModuleName =
  | "threat_detector"
  | "phishing_classifier"
  | "login_anomaly"
  | "missed_call_reply"
  | "popia_checker";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type DetectionStatus =
  | "new"
  | "acknowledged"
  | "investigating"
  | "resolved"
  | "false_positive";

export interface AIDetectionResult {
  module: AIModuleName;
  severity: Severity;
  riskScore: number; // 0-100
  isThreat: boolean;
  title: string;
  description: string;
  action: string;
  sourceType?: string;
  sourceId?: string;
  rawInput?: string;
  rawOutput?: string;
}

// Threat Detector input
export interface ThreatDetectorInput {
  eventType: "login" | "network" | "file" | "process" | "dns" | "firewall";
  sourceIp?: string;
  destinationIp?: string;
  port?: number;
  protocol?: string;
  payload?: string;
  userId?: string;
  deviceId?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

// Phishing Classifier input
export interface PhishingClassifierInput {
  from: string;
  to: string;
  subject: string;
  bodyPreview: string; // first 300 chars
  headers?: Record<string, string>;
  hasAttachment?: boolean;
  attachmentTypes?: string[];
  urls?: string[];
}

// Login Anomaly Detector input
export interface LoginAnomalyInput {
  userId: string;
  email: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  country?: string;
  city?: string;
  loginHistory?: Array<{
    ip: string;
    timestamp: string;
    userAgent: string;
    success: boolean;
  }>;
}

// Missed-Call Reply input
export interface MissedCallReplyInput {
  callerNumber: string;
  callTime: string;
  businessName: string;
  recentInteractions?: Array<{
    type: string;
    timestamp: string;
    summary: string;
  }>;
}

export interface MissedCallReplyResult extends AIDetectionResult {
  suggestedReplies: string[];
}

// POPIA Compliance input
export interface POPIACheckInput {
  dataType: "consent_record" | "data_inventory" | "breach_report" | "data_request";
  fields: Record<string, unknown>;
  description?: string;
}

export interface POPIACheckResult extends AIDetectionResult {
  complianceScore: number;
  missingItems: string[];
  recommendations: string[];
}

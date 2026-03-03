import type { POPIACheckInput, POPIACheckResult } from "./types";

// POPIA compliance rules by data type
const CONSENT_REQUIRED_FIELDS = [
  { field: "data_subject_name", label: "Data subject name", weight: 15 },
  { field: "consent_date", label: "Date consent was given", weight: 15 },
  { field: "consent_method", label: "Method of consent (written/electronic/verbal)", weight: 10 },
  { field: "purpose", label: "Specific purpose for processing", weight: 20 },
  { field: "data_categories", label: "Categories of personal data collected", weight: 10 },
  { field: "retention_period", label: "Data retention period", weight: 10 },
  { field: "withdrawal_mechanism", label: "Mechanism to withdraw consent", weight: 10 },
  { field: "third_party_sharing", label: "Third-party sharing disclosure", weight: 5 },
  { field: "cross_border_transfer", label: "Cross-border transfer disclosure", weight: 5 },
];

const DATA_INVENTORY_REQUIRED_FIELDS = [
  { field: "data_category", label: "Category of personal information", weight: 15 },
  { field: "purpose", label: "Purpose of processing", weight: 15 },
  { field: "legal_basis", label: "Legal basis for processing (POPIA Section 11)", weight: 15 },
  { field: "data_source", label: "Source of data", weight: 10 },
  { field: "retention_period", label: "Retention period", weight: 10 },
  { field: "security_measures", label: "Security measures in place", weight: 10 },
  { field: "access_controls", label: "Access control measures", weight: 10 },
  { field: "responsible_party", label: "Responsible party details", weight: 5 },
  { field: "information_officer", label: "Information officer contact", weight: 5 },
  { field: "data_subjects", label: "Data subject categories", weight: 5 },
];

const BREACH_REPORT_REQUIRED_FIELDS = [
  { field: "breach_date", label: "Date breach was discovered", weight: 10 },
  { field: "breach_description", label: "Description of the breach", weight: 10 },
  { field: "data_affected", label: "Categories of data affected", weight: 10 },
  { field: "subjects_affected", label: "Number of data subjects affected", weight: 10 },
  { field: "notification_date", label: "Date Information Regulator was notified", weight: 15 },
  { field: "subject_notification_date", label: "Date data subjects were notified", weight: 15 },
  { field: "remedial_actions", label: "Remedial actions taken", weight: 10 },
  { field: "risk_assessment", label: "Risk assessment of the breach", weight: 10 },
  { field: "prevention_measures", label: "Measures to prevent recurrence", weight: 10 },
];

const DATA_REQUEST_REQUIRED_FIELDS = [
  { field: "request_type", label: "Type of request (access/correction/deletion/objection)", weight: 15 },
  { field: "request_date", label: "Date of request", weight: 10 },
  { field: "requester_identity", label: "Identity verification of requester", weight: 15 },
  { field: "response_date", label: "Date of response", weight: 15 },
  { field: "response_outcome", label: "Outcome of request", weight: 10 },
  { field: "reason_if_refused", label: "Reason for refusal (if applicable)", weight: 10 },
  { field: "escalation_info", label: "Escalation/complaint information provided", weight: 10 },
  { field: "actions_taken", label: "Actions taken to fulfil request", weight: 15 },
];

// Text-based checks for common POPIA issues
const TEXT_CHECKS = [
  { pattern: /72\s*hours?|three\s*days?/i, label: "Breach notification timeline referenced", isGood: true },
  { pattern: /information\s*regulator/i, label: "Information Regulator referenced", isGood: true },
  { pattern: /section\s*(11|13|14|18|19|22)/i, label: "POPIA section referenced", isGood: true },
  { pattern: /indefinite|forever|unlimited\s*retention/i, label: "Indefinite retention (non-compliant)", isGood: false },
  { pattern: /no\s*consent|without\s*consent/i, label: "Processing without consent flagged", isGood: false },
  { pattern: /sell\s*(personal|data|information)/i, label: "Selling personal data (non-compliant)", isGood: false },
  { pattern: /unencrypted|plain\s*text\s*(password|storage)/i, label: "Unencrypted storage flagged", isGood: false },
  { pattern: /opt.?in|explicit\s*consent/i, label: "Opt-in consent mechanism", isGood: true },
  { pattern: /data\s*minimization|minimum\s*necessary/i, label: "Data minimization principle", isGood: true },
];

function getRequiredFields(dataType: POPIACheckInput["dataType"]) {
  switch (dataType) {
    case "consent_record": return CONSENT_REQUIRED_FIELDS;
    case "data_inventory": return DATA_INVENTORY_REQUIRED_FIELDS;
    case "breach_report": return BREACH_REPORT_REQUIRED_FIELDS;
    case "data_request": return DATA_REQUEST_REQUIRED_FIELDS;
    default: return CONSENT_REQUIRED_FIELDS;
  }
}

export function checkPOPIACompliance(input: POPIACheckInput): POPIACheckResult {
  const requiredFields = getRequiredFields(input.dataType);
  const missingItems: string[] = [];
  const recommendations: string[] = [];
  let fieldScore = 0;
  let maxFieldScore = 0;

  // 1. Check required fields
  for (const req of requiredFields) {
    maxFieldScore += req.weight;
    const value = input.fields[req.field];
    if (value !== undefined && value !== null && value !== "") {
      fieldScore += req.weight;
    } else {
      missingItems.push(req.label);
      recommendations.push(`Add "${req.label}" to your ${input.dataType.replace(/_/g, " ")}`);
    }
  }

  // 2. Text analysis on description
  let textBonus = 0;
  const textFindings: string[] = [];
  const description = input.description || "";
  const allText = description + " " + JSON.stringify(input.fields);

  for (const check of TEXT_CHECKS) {
    if (check.pattern.test(allText)) {
      if (check.isGood) {
        textBonus += 3;
        textFindings.push(`✓ ${check.label}`);
      } else {
        textBonus -= 5;
        textFindings.push(`✗ ${check.label}`);
        recommendations.push(`Address: ${check.label}`);
      }
    }
  }

  // 3. Breach-specific: check 72-hour notification
  if (input.dataType === "breach_report") {
    const breachDate = input.fields.breach_date as string | undefined;
    const notifDate = input.fields.notification_date as string | undefined;
    if (breachDate && notifDate) {
      const diff = new Date(notifDate).getTime() - new Date(breachDate).getTime();
      const hours = diff / (1000 * 60 * 60);
      if (hours > 72) {
        textBonus -= 15;
        missingItems.push("Notification within 72 hours (POPIA Section 22)");
        recommendations.push("CRITICAL: Breach notification must be made to the Information Regulator within 72 hours of becoming aware of the breach.");
      } else {
        textBonus += 5;
        textFindings.push("✓ Notification within 72-hour window");
      }
    }
  }

  // Calculate final compliance score
  const baseScore = maxFieldScore > 0 ? Math.round((fieldScore / maxFieldScore) * 100) : 0;
  const complianceScore = Math.min(100, Math.max(0, baseScore + textBonus));

  // Derive severity from compliance (inverted — lower compliance = higher severity)
  const riskScore = 100 - complianceScore;
  const severity = riskScore >= 70 ? "critical"
    : riskScore >= 50 ? "high"
      : riskScore >= 30 ? "medium"
        : riskScore >= 15 ? "low"
          : "info";
  const isThreat = complianceScore < 70;

  // Add general recommendations if score is low
  if (complianceScore < 50) {
    recommendations.push("Consider consulting with a POPIA compliance specialist.");
    recommendations.push("Review the Information Regulator's guidelines at https://inforegulator.org.za");
  }

  return {
    module: "popia_checker",
    severity,
    riskScore,
    isThreat,
    title: `POPIA Compliance: ${complianceScore}% for ${input.dataType.replace(/_/g, " ")}`,
    description: `Compliance score: ${complianceScore}/100. ${missingItems.length} missing items. ${textFindings.length} text indicators found.`,
    action: complianceScore >= 80
      ? "Good compliance level. Review minor gaps when convenient."
      : complianceScore >= 50
        ? "Moderate gaps. Address missing items within 30 days."
        : "Critical compliance gaps. Immediate action required to avoid regulatory penalties.",
    sourceType: input.dataType,
    rawInput: JSON.stringify(input),
    rawOutput: JSON.stringify({ complianceScore, fieldScore, maxFieldScore, textFindings, missingItems }),
    complianceScore,
    missingItems,
    recommendations,
  };
}

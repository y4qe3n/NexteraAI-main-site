-- AI Detections table: stores results from all AI modules
CREATE TABLE IF NOT EXISTS ai_detections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  module TEXT NOT NULL CHECK(module IN ('threat_detector', 'phishing_classifier', 'login_anomaly', 'missed_call_reply', 'popia_checker')),
  severity TEXT NOT NULL DEFAULT 'info' CHECK(severity IN ('critical', 'high', 'medium', 'low', 'info')),
  risk_score INTEGER NOT NULL DEFAULT 0 CHECK(risk_score >= 0 AND risk_score <= 100),
  is_threat INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  description TEXT,
  action TEXT,
  source_type TEXT,
  source_id TEXT,
  raw_input TEXT,
  raw_output TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'acknowledged', 'investigating', 'resolved', 'false_positive')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX IF NOT EXISTS idx_ai_detections_org ON ai_detections(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_detections_module ON ai_detections(module);
CREATE INDEX IF NOT EXISTS idx_ai_detections_severity ON ai_detections(severity);
CREATE INDEX IF NOT EXISTS idx_ai_detections_status ON ai_detections(status);
CREATE INDEX IF NOT EXISTS idx_ai_detections_created ON ai_detections(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_detections_threat ON ai_detections(is_threat);

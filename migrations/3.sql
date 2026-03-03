
CREATE TABLE threats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  device_id INTEGER,
  threat_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  source TEXT,
  target TEXT,
  status TEXT DEFAULT 'detected',
  description TEXT,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_threats_organization_id ON threats(organization_id);
CREATE INDEX idx_threats_status ON threats(status);
CREATE INDEX idx_threats_detected_at ON threats(detected_at);

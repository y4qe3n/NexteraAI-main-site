
CREATE TABLE email_scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  sender TEXT,
  subject TEXT,
  scan_result TEXT NOT NULL,
  threat_detected BOOLEAN DEFAULT 0,
  threat_type TEXT,
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_scans_organization_id ON email_scans(organization_id);
CREATE INDEX idx_email_scans_scanned_at ON email_scans(scanned_at);

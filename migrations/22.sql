-- Ensure threats table exists
CREATE TABLE IF NOT EXISTS threats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  threat_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  source TEXT,
  target TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  action_taken TEXT,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Ensure devices table exists
CREATE TABLE IF NOT EXISTS devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  device_type TEXT,
  os TEXT,
  is_protected INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Ensure backups table exists
CREATE TABLE IF NOT EXISTS backups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  backup_name TEXT NOT NULL,
  backup_size INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Ensure email_scans table exists
CREATE TABLE IF NOT EXISTS email_scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  email_subject TEXT,
  sender TEXT,
  is_threat INTEGER DEFAULT 0,
  threat_type TEXT,
  action_taken TEXT,
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_threats_org ON threats(organization_id);
CREATE INDEX IF NOT EXISTS idx_threats_status ON threats(status);
CREATE INDEX IF NOT EXISTS idx_devices_org ON devices(organization_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_backups_org ON backups(organization_id);
CREATE INDEX IF NOT EXISTS idx_email_scans_org ON email_scans(organization_id);

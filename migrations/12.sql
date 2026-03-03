-- Missed Call Follow-up feature tables

CREATE TABLE IF NOT EXISTS missed_call_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  enabled INTEGER DEFAULT 0,
  sms_template TEXT DEFAULT 'Hi, sorry we missed your call to {business_name} at {time}. How can we help? Reply here or call back.',
  business_name TEXT DEFAULT '',
  virtual_number TEXT DEFAULT '',
  max_sms_per_caller_per_day INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  UNIQUE(organization_id)
);

CREATE TABLE IF NOT EXISTS missed_call_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  caller_number TEXT NOT NULL,
  call_time TEXT NOT NULL,
  call_status TEXT NOT NULL DEFAULT 'no-answer',
  sms_sent INTEGER DEFAULT 0,
  sms_sent_at TEXT,
  sms_message TEXT,
  reply_received INTEGER DEFAULT 0,
  reply_text TEXT,
  reply_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS sms_opt_outs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  phone_number TEXT NOT NULL,
  opted_out_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  UNIQUE(organization_id, phone_number)
);

CREATE INDEX IF NOT EXISTS idx_missed_call_logs_org ON missed_call_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_missed_call_logs_caller ON missed_call_logs(caller_number);
CREATE INDEX IF NOT EXISTS idx_missed_call_logs_time ON missed_call_logs(call_time);
CREATE INDEX IF NOT EXISTS idx_sms_opt_outs_org_phone ON sms_opt_outs(organization_id, phone_number);

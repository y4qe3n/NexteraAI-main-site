-- Onboarding data table

CREATE TABLE IF NOT EXISTS onboarding_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  -- Step 1: Business Basics
  business_name TEXT,
  business_type TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  physical_address TEXT,
  -- Step 2: Tools & Setup
  email_provider TEXT,
  cloud_storage TEXT,
  device_count INTEGER,
  existing_antivirus TEXT,
  uses_mfa TEXT,
  collects_customer_data INTEGER DEFAULT 0,
  has_whatsapp_business INTEGER DEFAULT 0,
  -- Step 3: Preferences
  preferred_alert_method TEXT,
  wants_missed_call_sms INTEGER DEFAULT 0,
  security_concerns TEXT,
  staff_training_count INTEGER DEFAULT 1,
  -- Meta
  onboarding_completed INTEGER DEFAULT 0,
  completed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(organization_id)
);

CREATE INDEX IF NOT EXISTS idx_onboarding_org ON onboarding_data(organization_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_user ON onboarding_data(user_id);

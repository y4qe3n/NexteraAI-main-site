
CREATE TABLE organizations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  industry TEXT,
  employee_count INTEGER,
  plan TEXT DEFAULT 'basic',
  devices_limit INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organizations_user_id ON organizations(user_id);

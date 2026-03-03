CREATE TABLE IF NOT EXISTS login_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  login_time TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  login_method TEXT DEFAULT 'password',
  status TEXT DEFAULT 'success',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS login_activities_org_idx ON login_activities(organization_id);
CREATE INDEX IF NOT EXISTS login_activities_user_idx ON login_activities(user_id);

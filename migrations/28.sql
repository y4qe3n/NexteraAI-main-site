-- Owner-issued desktop agent invite/access support.
--
-- Production-safe intent:
-- - additive only
-- - no plaintext agent access tokens
-- - no auto-blocking or quarantine behavior
-- - no changes to payment, subscription, or existing user auth tables

CREATE TABLE IF NOT EXISTS agent_invites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invite_id TEXT NOT NULL UNIQUE,
  org_id TEXT NOT NULL,
  organization_id TEXT,
  token_prefix TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_by_user_id TEXT NOT NULL,
  max_uses INTEGER NOT NULL DEFAULT 1,
  uses INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0,
  revoked_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS agent_access_devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id TEXT NOT NULL UNIQUE,
  org_id TEXT NOT NULL,
  organization_id TEXT,
  invite_id TEXT,
  device_name TEXT,
  device_fingerprint_hash TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  first_seen_at TEXT,
  last_seen_at TEXT,
  agent_version TEXT,
  app_version TEXT,
  session_token_prefix TEXT,
  session_token_hash TEXT,
  session_expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (invite_id) REFERENCES agent_invites(invite_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_invites_org_id ON agent_invites(org_id);
CREATE INDEX IF NOT EXISTS idx_agent_invites_organization_id ON agent_invites(organization_id);
CREATE INDEX IF NOT EXISTS idx_agent_invites_token_hash ON agent_invites(token_hash);
CREATE INDEX IF NOT EXISTS idx_agent_invites_status ON agent_invites(revoked, expires_at, uses, max_uses);
CREATE INDEX IF NOT EXISTS idx_agent_access_devices_org_id ON agent_access_devices(org_id);
CREATE INDEX IF NOT EXISTS idx_agent_access_devices_organization_id ON agent_access_devices(organization_id);
CREATE INDEX IF NOT EXISTS idx_agent_access_devices_status ON agent_access_devices(status);

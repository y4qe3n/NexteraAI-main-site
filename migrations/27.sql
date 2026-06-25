-- Internal Admin organisation lifecycle and first-user password setup support.
--
-- Production-safe intent:
-- - additive only
-- - no hard deletes
-- - no seed/demo users
-- - no default passwords
-- - no raw invite/reset tokens
-- - no payment, subscription, device, or audit history changes

ALTER TABLE organizations ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE organizations ADD COLUMN deactivated_at TEXT;
ALTER TABLE organizations ADD COLUMN deactivated_by TEXT;
ALTER TABLE organizations ADD COLUMN deleted_at TEXT;
ALTER TABLE organizations ADD COLUMN deleted_by TEXT;

ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX IF NOT EXISTS idx_organizations_deleted_at ON organizations(deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_must_change_password ON users(must_change_password);

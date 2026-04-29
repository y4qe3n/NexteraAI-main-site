-- Invite System Migration
-- Add columns to users table for role-based access and invite flow
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'employee';
ALTER TABLE users ADD COLUMN organization_id INTEGER;
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN failed_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN lockout_until TIMESTAMP;

-- Create invite_tokens table for secure employee invitations
CREATE TABLE IF NOT EXISTS invite_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  organization_id INTEGER NOT NULL,
  role TEXT DEFAULT 'employee',
  invited_by_user_id INTEGER NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used INTEGER DEFAULT 0,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (invited_by_user_id) REFERENCES users(id)
);

-- Add owner_id to devices table for employee-specific device assignment
ALTER TABLE devices ADD COLUMN owner_id INTEGER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_token ON invite_tokens(token);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_email ON invite_tokens(email);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_organization_id ON invite_tokens(organization_id);
CREATE INDEX IF NOT EXISTS idx_devices_owner_id ON devices(owner_id);

-- Set existing users as admins and link to their organizations
UPDATE users SET role = 'admin' WHERE role IS NULL OR role = 'employee';
UPDATE users SET organization_id = (SELECT id FROM organizations WHERE organizations.user_id = users.id) WHERE organization_id IS NULL;

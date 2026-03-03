-- Fix: auth_sessions had FK to auth_users; after dropping auth_users, INSERTs failed with "no such table: auth_users"
DROP TABLE IF EXISTS auth_sessions;
DROP TABLE IF EXISTS auth_users;

CREATE TABLE auth_sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX idx_auth_sessions_expires_at ON auth_sessions(expires_at);

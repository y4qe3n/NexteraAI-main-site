
-- Users table with Argon2id password hashing support
CREATE TABLE IF NOT EXISTS users (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  email             TEXT UNIQUE NOT NULL,
  username          TEXT UNIQUE,
  password_hash     TEXT NOT NULL,
  created_at        TEXT DEFAULT (datetime('now')),
  last_login        TEXT,
  failed_attempts   INTEGER DEFAULT 0,
  lockout_until     TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Recreate auth_sessions so it no longer references auth_users (FK was causing "no such table: auth_users")
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

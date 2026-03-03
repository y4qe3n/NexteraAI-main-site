
-- Login OTPs for email 2FA: store only hash + metadata, never plain OTP
CREATE TABLE login_otps (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  otp_token         TEXT UNIQUE NOT NULL,
  user_id           INTEGER NOT NULL,
  otp_hash          TEXT NOT NULL,
  expires_at        TEXT NOT NULL,
  sent_at           TEXT NOT NULL,
  failed_attempts   INTEGER DEFAULT 0,
  created_at        TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_login_otps_otp_token ON login_otps(otp_token);
CREATE INDEX idx_login_otps_user_id ON login_otps(user_id);
CREATE INDEX idx_login_otps_expires_at ON login_otps(expires_at);
CREATE INDEX idx_login_otps_sent_at ON login_otps(sent_at);

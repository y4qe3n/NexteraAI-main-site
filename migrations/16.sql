-- Training modules and user progress tables

CREATE TABLE IF NOT EXISTS training_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_module_progress (
  user_id INTEGER NOT NULL,
  module_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  updated_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, module_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (module_id) REFERENCES training_modules(id)
);

CREATE INDEX IF NOT EXISTS idx_training_modules_title ON training_modules(title);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_status ON user_module_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user ON user_module_progress(user_id);

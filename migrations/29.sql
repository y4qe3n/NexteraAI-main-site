-- NexteraAI Security Academy v1 progress and assignment storage.
--
-- Production-safe intent:
-- - additive only
-- - course content remains versioned in application config
-- - stores assignments, progress, and quiz attempts only
-- - all rows are organisation scoped
-- - no auth, billing, agent, payment, Threat Protection, or blocking behavior changes

CREATE TABLE IF NOT EXISTS training_assignments (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  assigned_to_user_id TEXT NOT NULL,
  assigned_by_user_id TEXT NOT NULL,
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'not_started',
  reminder_requested INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS training_progress (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  lesson_progress_json TEXT NOT NULL DEFAULT '{}',
  quiz_score INTEGER,
  status TEXT NOT NULL DEFAULT 'not_started',
  last_activity_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (organization_id, user_id, module_id)
);

CREATE TABLE IF NOT EXISTS training_quiz_attempts (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  passed INTEGER NOT NULL DEFAULT 0,
  answers_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_training_assignments_org ON training_assignments(organization_id);
CREATE INDEX IF NOT EXISTS idx_training_assignments_user ON training_assignments(organization_id, assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_training_assignments_due ON training_assignments(organization_id, due_date, status);
CREATE INDEX IF NOT EXISTS idx_training_progress_org ON training_progress(organization_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_user ON training_progress(organization_id, user_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_module ON training_progress(organization_id, module_id);
CREATE INDEX IF NOT EXISTS idx_training_quiz_attempts_user ON training_quiz_attempts(organization_id, user_id, module_id);

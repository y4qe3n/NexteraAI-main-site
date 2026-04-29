CREATE TABLE IF NOT EXISTS detection_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  detection_id INTEGER NOT NULL UNIQUE REFERENCES ai_detections(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  attack_category TEXT NOT NULL,
  notes TEXT,
  source_snapshot TEXT,
  exported INTEGER DEFAULT 0,
  export_batch TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  exported_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_detection_feedback_attack_category ON detection_feedback(attack_category);
CREATE INDEX IF NOT EXISTS idx_detection_feedback_exported ON detection_feedback(exported);

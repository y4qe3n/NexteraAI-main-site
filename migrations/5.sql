
CREATE TABLE compliance_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  compliance_item_id INTEGER NOT NULL,
  status TEXT DEFAULT 'not_started',
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_compliance_status_organization_id ON compliance_status(organization_id);
CREATE UNIQUE INDEX idx_compliance_status_unique ON compliance_status(organization_id, compliance_item_id);

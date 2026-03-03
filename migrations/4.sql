
CREATE TABLE compliance_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  requirement_level TEXT DEFAULT 'required',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO compliance_items (category, title, description, requirement_level, sort_order) VALUES
('data_collection', 'Lawful Processing Basis', 'Document the lawful basis for processing personal information', 'required', 1),
('data_collection', 'Purpose Specification', 'Clearly specify and document the purpose of data collection', 'required', 2),
('data_collection', 'Data Minimisation', 'Only collect personal information that is necessary', 'required', 3),
('consent', 'Consent Management', 'Obtain and record consent for data processing', 'required', 4),
('consent', 'Opt-out Mechanism', 'Provide easy opt-out options for direct marketing', 'required', 5),
('consent', 'Privacy Notice', 'Display clear privacy notice at point of collection', 'required', 6),
('security', 'Access Controls', 'Implement appropriate access controls to personal data', 'required', 7),
('security', 'Encryption', 'Encrypt personal information in transit and at rest', 'required', 8),
('security', 'Security Measures', 'Implement technical and organisational security measures', 'required', 9),
('security', 'Breach Notification', 'Have breach notification procedures in place', 'required', 10),
('rights', 'Access Requests', 'Process for handling data subject access requests', 'required', 11),
('rights', 'Correction Requests', 'Process for correcting personal information', 'required', 12),
('rights', 'Deletion Requests', 'Process for deleting personal information', 'required', 13),
('governance', 'Information Officer', 'Designate an Information Officer', 'required', 14),
('governance', 'PAIA Manual', 'Maintain a PAIA manual', 'required', 15),
('governance', 'Staff Training', 'Train staff on POPIA requirements', 'recommended', 16),
('governance', 'Third Party Agreements', 'Operator agreements with third parties', 'required', 17),
('governance', 'Data Retention Policy', 'Document data retention and destruction policy', 'required', 18);

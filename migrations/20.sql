
-- Add a role column so we can distinguish admins and employees
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'admin';

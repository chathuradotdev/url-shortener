-- Add action button columns to system_alerts table
ALTER TABLE system_alerts 
ADD COLUMN IF NOT EXISTS action_label TEXT,
ADD COLUMN IF NOT EXISTS action_url TEXT;

-- Add audience column to system_alerts table
ALTER TABLE system_alerts 
ADD COLUMN IF NOT EXISTS audience TEXT DEFAULT 'all'; -- 'all', 'guest', 'user'

-- Update index (optional but good for perf)
DROP INDEX IF EXISTS idx_system_alerts_active_dates;
CREATE INDEX idx_system_alerts_active_audience ON system_alerts(is_active, audience, start_date, end_date);

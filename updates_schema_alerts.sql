-- Create system_alerts table
CREATE TABLE IF NOT EXISTS system_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'success', 'promo'
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy to allow public read access for active alerts (if we use RLS)
-- ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read active alerts" ON system_alerts FOR SELECT USING (is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));

-- But since we use the service role key in db.ts, RLS might not strictly apply depending on how the client is initialized (db.ts uses anon_key or service_role_key depending on config).
-- Actually db.ts allows using service key if available.

-- Index for querying active alerts
CREATE INDEX IF NOT EXISTS idx_system_alerts_active_dates ON system_alerts(is_active, start_date, end_date);

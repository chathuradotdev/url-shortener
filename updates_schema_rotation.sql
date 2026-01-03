
-- Update URLs table to support A/B Split Testing & Link Rotation
ALTER TABLE urls 
ADD COLUMN IF NOT EXISTS rotation_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS rotation_mode TEXT CHECK (rotation_mode IN ('weighted', 'sequential')),
ADD COLUMN IF NOT EXISTS rotation_rules JSONB DEFAULT '[]'::jsonb;

-- Comment on columns
COMMENT ON COLUMN urls.rotation_enabled IS 'Enables traffic splitting/rotation';
COMMENT ON COLUMN urls.rotation_mode IS 'weighted (A/B testing) or sequential (round robin)';
COMMENT ON COLUMN urls.rotation_rules IS 'Array of rules for rotation';

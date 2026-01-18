-- Migration: Add missing columns to urls table
-- This adds all the advanced features columns that are referenced in the code

-- Deep linking columns
ALTER TABLE urls ADD COLUMN IF NOT EXISTS android_deep_link TEXT;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS ios_deep_link TEXT;

-- Redirect type
ALTER TABLE urls ADD COLUMN IF NOT EXISTS permanent_redirect BOOLEAN DEFAULT false;

-- Interim page feature
ALTER TABLE urls ADD COLUMN IF NOT EXISTS interim_page_enabled BOOLEAN DEFAULT false;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS interim_message TEXT;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS interim_duration INTEGER DEFAULT 5;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS interim_visit_limit INTEGER DEFAULT 0;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS interim_visit_count INTEGER DEFAULT 0;

-- Smart targeting
ALTER TABLE urls ADD COLUMN IF NOT EXISTS targeting_enabled BOOLEAN DEFAULT false;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS geo_targeting JSONB;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS time_targeting JSONB;

-- Link expiration and burn after reading
ALTER TABLE urls ADD COLUMN IF NOT EXISTS expiration_redirect_url TEXT;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS burn_after_reading BOOLEAN DEFAULT false;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS burn_visit_limit INTEGER;

-- Social media preview customization
ALTER TABLE urls ADD COLUMN IF NOT EXISTS social_title TEXT;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS social_description TEXT;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS social_image TEXT;

-- Link rotation
ALTER TABLE urls ADD COLUMN IF NOT EXISTS rotation_enabled BOOLEAN DEFAULT false;
ALTER TABLE urls ADD COLUMN IF NOT EXISTS rotation_mode TEXT CHECK (rotation_mode IN ('weighted', 'sequential'));
ALTER TABLE urls ADD COLUMN IF NOT EXISTS rotation_rules JSONB;

-- Branded domains
ALTER TABLE urls ADD COLUMN IF NOT EXISTS domain TEXT;

-- Create index for domain lookups
CREATE INDEX IF NOT EXISTS idx_urls_domain ON urls(domain);
CREATE INDEX IF NOT EXISTS idx_urls_short_code_domain ON urls(short_code, domain);

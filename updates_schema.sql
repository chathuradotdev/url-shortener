-- Add missing columns for Deep Linking and Permanent Redirects
-- Run this in your Supabase 'SQL Editor'

ALTER TABLE urls
ADD COLUMN IF NOT EXISTS android_deep_link text,
ADD COLUMN IF NOT EXISTS ios_deep_link text,
ADD COLUMN IF NOT EXISTS permanent_redirect boolean default false;

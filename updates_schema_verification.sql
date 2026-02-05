-- Add email verification fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires timestamp with time zone;

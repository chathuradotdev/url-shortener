-- Add company branding fields to users table
-- This allows users to customize the footer branding on their bio pages

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS company_branding_type VARCHAR(10) DEFAULT 'default' CHECK (company_branding_type IN ('default', 'text', 'image')),
ADD COLUMN IF NOT EXISTS company_branding_text VARCHAR(50),
ADD COLUMN IF NOT EXISTS company_branding_image TEXT;

-- Add comments for documentation
COMMENT ON COLUMN users.company_branding_type IS 'Type of branding to display on bio pages: default (Made with liinks.co), text (custom text), or image (company logo)';
COMMENT ON COLUMN users.company_branding_text IS 'Custom text to display in bio page footer (max 50 characters)';
COMMENT ON COLUMN users.company_branding_image IS 'URL of company logo image to display in bio page footer';

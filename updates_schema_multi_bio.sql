-- Migration script to support Multiple Bio Pages and advanced Link features
-- Run this in your Supabase 'SQL Editor'

-- 1. Support Multiple Bio Pages per User
-- First, we need to find and drop the unique constraint on user_id in bio_pages
-- Note: In Supabase/PostgreSQL, dropping a constraint requires its name. 
-- Usually it's 'bio_pages_user_id_key'. We'll use a DO block to find it safely.

DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name='bio_pages' AND constraint_type='UNIQUE'
    ) THEN
        -- Attempt to drop the most common constraint name for the unique user_id
        ALTER TABLE bio_pages DROP CONSTRAINT IF EXISTS bio_pages_user_id_key;
    END IF;
END $$;

-- 2. Add Missing Columns to Bio Pages
ALTER TABLE bio_pages ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 3. Add Missing Columns to Bio Links
ALTER TABLE bio_links ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;
ALTER TABLE bio_links ADD COLUMN IF NOT EXISTS animation TEXT;
ALTER TABLE bio_links ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 4. Ensure Slugs remain unique
-- (This should already be unique based on previous schema, but good to ensure)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name='bio_pages' AND constraint_type='UNIQUE' AND constraint_name='bio_pages_slug_key'
    ) THEN
        ALTER TABLE bio_pages ADD CONSTRAINT bio_pages_slug_key UNIQUE (slug);
    END IF;
END $$;

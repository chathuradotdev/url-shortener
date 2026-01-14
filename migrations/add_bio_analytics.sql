-- Add views column to bio_pages table
ALTER TABLE bio_pages 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Add clicks column to bio_links table
ALTER TABLE bio_links 
ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;

-- Optional: Create an index on views/clicks if sorting is needed often, 
-- though usually we just read by ID.

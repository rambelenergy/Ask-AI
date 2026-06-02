-- Create publications table for RamBelEnergy CMS
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  publication_date TIMESTAMP WITH TIME ZONE,
  external_url TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- Policy: allow public read of all publications
CREATE POLICY "Allow public read publications" ON publications
  FOR SELECT USING (true);

-- Policy: allow authenticated admin full access
CREATE POLICY "Allow admin full access" ON publications
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create index on slug for fast lookup
CREATE INDEX idx_publications_slug ON publications(slug);

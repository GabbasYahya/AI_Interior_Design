-- Add new tables for AI room generation and Adariz products

-- Table for storing Adariz products from Instagram
CREATE TABLE IF NOT EXISTS adariz_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  style TEXT[] DEFAULT '{}',
  instagram_post_id TEXT,
  instagram_post_url TEXT,
  tags TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for storing generated rooms
CREATE TABLE IF NOT EXISTS generated_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  design_elements TEXT[] DEFAULT '{}',
  ai_prompt TEXT,
  room_type TEXT NOT NULL,
  dimensions JSONB,
  style_profile JSONB,
  recommended_products JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for Instagram scraping metadata
CREATE TABLE IF NOT EXISTS instagram_sync (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  total_posts_processed INTEGER DEFAULT 0,
  total_products_extracted INTEGER DEFAULT 0,
  status TEXT DEFAULT 'idle',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on new tables
ALTER TABLE adariz_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_sync ENABLE ROW LEVEL SECURITY;

-- RLS policies for adariz_products (public read)
CREATE POLICY "Allow public read access to adariz_products" ON adariz_products
FOR SELECT USING (true);

-- RLS policies for generated_rooms (user-specific)
CREATE POLICY "Users can view their own generated rooms" ON generated_rooms
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generated rooms" ON generated_rooms
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated rooms" ON generated_rooms
FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for instagram_sync (admin only)
CREATE POLICY "Only authenticated users can view instagram_sync" ON instagram_sync
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_adariz_products_category ON adariz_products(category);
CREATE INDEX IF NOT EXISTS idx_adariz_products_style ON adariz_products USING GIN(style);
CREATE INDEX IF NOT EXISTS idx_adariz_products_in_stock ON adariz_products(in_stock);
CREATE INDEX IF NOT EXISTS idx_generated_rooms_user_id ON generated_rooms(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_rooms_room_type ON generated_rooms(room_type);
CREATE INDEX IF NOT EXISTS idx_generated_rooms_created_at ON generated_rooms(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating updated_at
CREATE TRIGGER update_adariz_products_updated_at
  BEFORE UPDATE ON adariz_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_rooms_updated_at
  BEFORE UPDATE ON generated_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instagram_sync_updated_at
  BEFORE UPDATE ON instagram_sync
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

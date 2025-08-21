-- =============================================
-- AI Interior Canvas - Database Schema
-- =============================================
-- Run this in your Supabase SQL Editor to create all tables

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- =============================================
-- 1. PROFILES TABLE (User profiles)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'premium', 'pro')),
    credits INTEGER DEFAULT 5,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

-- =============================================
-- 2. PROJECTS TABLE (User design projects)
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    room_type TEXT NOT NULL, -- 'living_room', 'bedroom', 'kitchen', etc.
    style_preference TEXT, -- 'modern', 'traditional', 'minimalist', etc.
    budget_min INTEGER, -- minimum budget in currency units
    budget_max INTEGER, -- maximum budget in currency units
    budget_range TEXT, -- 'low', 'medium', 'high' (deprecated, kept for compatibility)
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own projects" 
    ON projects FOR ALL 
    USING (auth.uid() = user_id);

-- =============================================
-- 3. ROOM_MEASUREMENTS TABLE (3D measurements)
-- =============================================
CREATE TABLE IF NOT EXISTS room_measurements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    length DECIMAL(10,2) NOT NULL, -- in meters
    width DECIMAL(10,2) NOT NULL,
    height DECIMAL(10,2) NOT NULL,
    doors JSONB DEFAULT '[]', -- Array of door objects with positions
    windows JSONB DEFAULT '[]', -- Array of window objects with positions
    obstacles JSONB DEFAULT '[]', -- Pillars, built-ins, etc.
    measurements_data JSONB DEFAULT '{}', -- Additional measurement data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for room_measurements
ALTER TABLE room_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage measurements for own projects" 
    ON room_measurements FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = room_measurements.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- =============================================
-- 4. ROOM_PHOTOS TABLE (Photo uploads)
-- =============================================
CREATE TABLE IF NOT EXISTS room_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    file_path TEXT NOT NULL, -- Path in Supabase Storage
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    photo_type TEXT DEFAULT 'original' CHECK (photo_type IN ('original', 'ai_generated', 'edited')),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for room_photos
ALTER TABLE room_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage photos for own projects" 
    ON room_photos FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = room_photos.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- =============================================
-- 5. STYLE_QUIZ_RESULTS TABLE (Quiz responses)
-- =============================================
CREATE TABLE IF NOT EXISTS style_quiz_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    quiz_responses JSONB NOT NULL, -- All quiz answers
    calculated_style TEXT NOT NULL, -- Resulting style: 'modern', 'traditional', etc.
    style_scores JSONB NOT NULL, -- Scores for each style category
    recommendations JSONB DEFAULT '{}', -- AI-generated recommendations
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for style_quiz_results
ALTER TABLE style_quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own quiz results" 
    ON style_quiz_results FOR ALL 
    USING (auth.uid() = user_id);

-- =============================================
-- 6. AI_DESIGNS TABLE (AI-generated designs)
-- =============================================
CREATE TABLE IF NOT EXISTS ai_designs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    design_prompt TEXT NOT NULL,
    ai_model_used TEXT DEFAULT 'interior-ai-v1',
    generated_images JSONB DEFAULT '[]', -- Array of generated image URLs
    design_elements JSONB DEFAULT '{}', -- Furniture, colors, materials suggested
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    generation_time INTEGER, -- Time taken in seconds
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for ai_designs
ALTER TABLE ai_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage AI designs for own projects" 
    ON ai_designs FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = ai_designs.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- =============================================
-- 7. FAVORITES TABLE (User favorites)
-- =============================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    favoritable_type TEXT NOT NULL CHECK (favoritable_type IN ('project', 'ai_design', 'photo')),
    favoritable_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique favorites
    UNIQUE(user_id, favoritable_type, favoritable_id)
);

-- RLS Policies for favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" 
    ON favorites FOR ALL 
    USING (auth.uid() = user_id);

-- =============================================
-- 8. PRODUCT_RECOMMENDATIONS TABLE (Furniture & decor)
-- =============================================
CREATE TABLE IF NOT EXISTS product_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    ai_design_id UUID REFERENCES ai_designs(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_category TEXT NOT NULL, -- 'furniture', 'lighting', 'decor', etc.
    product_description TEXT,
    estimated_price DECIMAL(10,2),
    product_url TEXT,
    image_url TEXT,
    ai_reasoning TEXT, -- Why this product was recommended
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for product_recommendations
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view recommendations for own projects" 
    ON product_recommendations FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = product_recommendations.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- =============================================
-- STORAGE BUCKETS
-- =============================================
-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('room-photos', 'room-photos', false),
    ('ai-generated-images', 'ai-generated-images', false),
    ('user-avatars', 'user-avatars', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for room-photos bucket
CREATE POLICY "Users can upload room photos" 
    ON storage.objects FOR INSERT 
    WITH CHECK (
        bucket_id = 'room-photos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own room photos" 
    ON storage.objects FOR SELECT 
    USING (
        bucket_id = 'room-photos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own room photos" 
    ON storage.objects FOR DELETE 
    USING (
        bucket_id = 'room-photos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for ai-generated-images bucket
CREATE POLICY "Users can view own AI images" 
    ON storage.objects FOR SELECT 
    USING (
        bucket_id = 'ai-generated-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for user-avatars bucket
CREATE POLICY "Users can manage own avatars" 
    ON storage.objects FOR ALL 
    USING (
        bucket_id = 'user-avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_measurements_updated_at 
    BEFORE UPDATE ON room_measurements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_room_measurements_project_id ON room_measurements(project_id);
CREATE INDEX IF NOT EXISTS idx_room_photos_project_id ON room_photos(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_designs_project_id ON ai_designs(project_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_style_quiz_user_id ON style_quiz_results(user_id);

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================
-- Uncomment the following to add sample data:
/*
-- Sample room types and styles
INSERT INTO projects (user_id, name, room_type, style_preference, status) VALUES
    (auth.uid(), 'Salon Principal', 'living_room', 'modern', 'completed'),
    (auth.uid(), 'Chambre à Coucher', 'bedroom', 'minimalist', 'in_progress'),
    (auth.uid(), 'Cuisine Moderne', 'kitchen', 'contemporary', 'draft');
*/

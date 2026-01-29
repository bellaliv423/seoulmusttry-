-- Seoul in a Bite Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Restaurants table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ko VARCHAR(255) NOT NULL,
  name_zh_tw VARCHAR(255),
  name_en VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone VARCHAR(20),
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INT DEFAULT 0,
  price_range INT DEFAULT 1 CHECK (price_range BETWEEN 1 AND 3),
  business_hours JSONB,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menus table
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name_ko VARCHAR(255) NOT NULL,
  name_zh_tw VARCHAR(255),
  name_en VARCHAR(255),
  description_ko TEXT,
  description_zh_tw TEXT,
  description_en TEXT,
  price INT NOT NULL,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  is_spicy BOOLEAN DEFAULT FALSE,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  avatar_url TEXT,
  preferred_language VARCHAR(10) DEFAULT 'zh_TW',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT,
  images TEXT[] DEFAULT '{}',
  language VARCHAR(10) DEFAULT 'zh_TW',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, restaurant_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_restaurants_category ON restaurants(category);
CREATE INDEX idx_restaurants_rating ON restaurants(rating DESC);
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX idx_menus_restaurant ON menus(restaurant_id);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_restaurant ON bookmarks(restaurant_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Restaurants: public read
CREATE POLICY "Restaurants are viewable by everyone"
  ON restaurants FOR SELECT
  USING (true);

-- Menus: public read
CREATE POLICY "Menus are viewable by everyone"
  ON menus FOR SELECT
  USING (true);

-- Profiles: users can view all profiles, but only update their own
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Reviews: public read, authenticated users can create/update/delete their own
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Bookmarks: users can only see and manage their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update restaurant rating when a review is added/modified
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurants
  SET
    rating = (
      SELECT COALESCE(AVG(rating)::DECIMAL(2,1), 0)
      FROM reviews
      WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.restaurant_id, OLD.restaurant_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for reviews
CREATE TRIGGER on_review_change
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON restaurants
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================
-- beforetheyrise.com — 完整数据库初始化
-- 在新 Supabase 项目的 SQL Editor 里运行
-- ================================================

-- 1. 艺术家表
CREATE TABLE IF NOT EXISTS art_artists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  school text,
  year text,
  bio text,
  photo_url text,
  instagram text,
  created_at timestamptz DEFAULT now()
);

-- 2. 作品表
CREATE TABLE IF NOT EXISTS art_works (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id uuid REFERENCES art_artists(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  medium text,
  width_cm numeric DEFAULT 0,
  height_cm numeric DEFAULT 0,
  year_created text,
  price numeric DEFAULT 0,
  status text DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  image_url text,
  cert_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- 3. 订单表
CREATE TABLE IF NOT EXISTS art_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id uuid REFERENCES art_works(id),
  buyer_name text,
  buyer_email text,
  amount numeric,
  stripe_payment_id text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- ================================================
-- 4. 开启 RLS
-- ================================================
ALTER TABLE art_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE art_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE art_orders ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 5. RLS 策略
-- ================================================

-- art_artists
DROP POLICY IF EXISTS "anyone can read artists" ON art_artists;
DROP POLICY IF EXISTS "user can insert own artist" ON art_artists;
DROP POLICY IF EXISTS "user can update own artist" ON art_artists;
DROP POLICY IF EXISTS "admin full access artists" ON art_artists;

CREATE POLICY "anyone can read artists" ON art_artists FOR SELECT USING (true);
CREATE POLICY "user can insert own artist" ON art_artists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user can update own artist" ON art_artists FOR UPDATE USING (auth.uid() = user_id);
-- service_role 绕过 RLS，admin 操作直接用 service key 即可

-- art_works
DROP POLICY IF EXISTS "anyone can read works" ON art_works;
DROP POLICY IF EXISTS "artist can insert own work" ON art_works;
DROP POLICY IF EXISTS "artist can update own work" ON art_works;

CREATE POLICY "anyone can read works" ON art_works FOR SELECT USING (true);
CREATE POLICY "artist can insert own work" ON art_works FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM art_artists WHERE id = artist_id AND user_id = auth.uid())
);
CREATE POLICY "artist can update own work" ON art_works FOR UPDATE USING (
  EXISTS (SELECT 1 FROM art_artists WHERE id = artist_id AND user_id = auth.uid())
);

-- art_orders
DROP POLICY IF EXISTS "anyone can insert order" ON art_orders;
DROP POLICY IF EXISTS "artist can read own orders" ON art_orders;

CREATE POLICY "anyone can insert order" ON art_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "artist can read own orders" ON art_orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM art_works w
    JOIN art_artists a ON a.id = w.artist_id
    WHERE w.id = work_id AND a.user_id = auth.uid()
  )
);

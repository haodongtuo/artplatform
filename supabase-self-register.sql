-- 1. 给 art_artists 加 user_id 字段（如果没有）
ALTER TABLE art_artists ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. 开启 RLS
ALTER TABLE art_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE art_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE art_orders ENABLE ROW LEVEL SECURITY;

-- 3. 删旧 policy（如果存在）再重建
DROP POLICY IF EXISTS "anyone can read artists" ON art_artists;
DROP POLICY IF EXISTS "user can insert own artist" ON art_artists;
DROP POLICY IF EXISTS "user can update own artist" ON art_artists;
DROP POLICY IF EXISTS "anyone can read works" ON art_works;
DROP POLICY IF EXISTS "artist can insert own work" ON art_works;
DROP POLICY IF EXISTS "artist can update own work" ON art_works;
DROP POLICY IF EXISTS "anyone can insert order" ON art_orders;
DROP POLICY IF EXISTS "artist can read own orders" ON art_orders;

-- 4. art_artists
CREATE POLICY "anyone can read artists" ON art_artists FOR SELECT USING (true);
CREATE POLICY "user can insert own artist" ON art_artists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user can update own artist" ON art_artists FOR UPDATE USING (auth.uid() = user_id);

-- 5. art_works
CREATE POLICY "anyone can read works" ON art_works FOR SELECT USING (true);
CREATE POLICY "artist can insert own work" ON art_works FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM art_artists WHERE id = artist_id AND user_id = auth.uid())
);
CREATE POLICY "artist can update own work" ON art_works FOR UPDATE USING (
  EXISTS (SELECT 1 FROM art_artists WHERE id = artist_id AND user_id = auth.uid())
);

-- 6. art_orders
CREATE POLICY "anyone can insert order" ON art_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "artist can read own orders" ON art_orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM art_works w
    JOIN art_artists a ON a.id = w.artist_id
    WHERE w.id = work_id AND a.user_id = auth.uid()
  )
);

-- 1. 给 art_artists 加 user_id 字段（如果没有）
ALTER TABLE art_artists ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. 开启 RLS
ALTER TABLE art_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE art_works ENABLE ROW LEVEL SECURITY;

-- 3. art_artists: 任何人可以读，登录用户可以插入自己的记录，只能改自己的
CREATE POLICY IF NOT EXISTS "anyone can read artists" ON art_artists FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "user can insert own artist" ON art_artists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "user can update own artist" ON art_artists FOR UPDATE USING (auth.uid() = user_id);

-- 4. art_works: 任何人可以读，登录用户可以插入（artist_id 属于自己）
CREATE POLICY IF NOT EXISTS "anyone can read works" ON art_works FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "artist can insert own work" ON art_works FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM art_artists WHERE id = artist_id AND user_id = auth.uid())
);
CREATE POLICY IF NOT EXISTS "artist can update own work" ON art_works FOR UPDATE USING (
  EXISTS (SELECT 1 FROM art_artists WHERE id = artist_id AND user_id = auth.uid())
);

-- 5. art_orders: 任何人可以插入（买家下单），卖家可以看自己的订单
CREATE POLICY IF NOT EXISTS "anyone can insert order" ON art_orders FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "artist can read own orders" ON art_orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM art_works w
    JOIN art_artists a ON a.id = w.artist_id
    WHERE w.id = work_id AND a.user_id = auth.uid()
  )
);

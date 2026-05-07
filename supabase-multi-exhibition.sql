-- ================================================
-- beforetheyrise.com — 多校展览系统
-- 在 Supabase SQL Editor 里运行
-- ================================================

-- 1. exhibitions 表
CREATE TABLE IF NOT EXISTS exhibitions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,                        -- "UCLA Graduation 2026"
  school text NOT NULL,                      -- "UCLA"
  city text NOT NULL,                        -- "Los Angeles"
  country text NOT NULL DEFAULT 'US',
  date date,                                 -- 展览日期
  status text DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'active', 'closed')),
  cover_image text,
  slug text UNIQUE NOT NULL,                 -- "ucla-2026" → /exhibition/ucla-2026
  description text,
  created_at timestamptz DEFAULT now()
);

-- 2. school_admins 表（各校独立登录）
CREATE TABLE IF NOT EXISTS school_admins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,               -- bcrypt hash
  exhibition_id uuid REFERENCES exhibitions(id) ON DELETE CASCADE,
  role text DEFAULT 'school'
    CHECK (role IN ('super', 'school')),
  created_at timestamptz DEFAULT now()
);

-- 3. art_works 加 exhibition_id 字段
ALTER TABLE art_works
  ADD COLUMN IF NOT EXISTS exhibition_id uuid REFERENCES exhibitions(id);

-- 4. art_artists 加 exhibition_id 字段（艺术家归属展览）
ALTER TABLE art_artists
  ADD COLUMN IF NOT EXISTS exhibition_id uuid REFERENCES exhibitions(id);

-- ================================================
-- 5. 插入第一个展览（LA 2026，现有数据归入此展）
-- ================================================
INSERT INTO exhibitions (name, school, city, country, date, status, slug, description)
VALUES (
  'Graduation Exhibition 2026',
  'Los Angeles Art Schools',
  'Los Angeles',
  'US',
  '2026-05-21',
  'active',
  'la-graduation-2026',
  'Original works by this year''s graduating students in Los Angeles — paintings, drawings, mixed media, and more. Each piece carries the energy of a beginning.'
)
ON CONFLICT (slug) DO NOTHING;

-- 6. 现有作品全部归入 LA 2026 展览
UPDATE art_works
SET exhibition_id = (SELECT id FROM exhibitions WHERE slug = 'la-graduation-2026')
WHERE exhibition_id IS NULL;

-- 现有艺术家全部归入 LA 2026 展览
UPDATE art_artists
SET exhibition_id = (SELECT id FROM exhibitions WHERE slug = 'la-graduation-2026')
WHERE exhibition_id IS NULL;

-- ================================================
-- 7. RLS
-- ================================================
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can read exhibitions" ON exhibitions;
CREATE POLICY "anyone can read exhibitions" ON exhibitions FOR SELECT USING (true);

-- school_admins 只能被 service_role 读写（后台用 service key，无需 RLS 细化）
DROP POLICY IF EXISTS "service role only admins" ON school_admins;
CREATE POLICY "service role only admins" ON school_admins FOR ALL USING (false);

-- ================================================
-- 完成！
-- ================================================

-- 🔧 RECREATE ai_edugame Table with Complete Schema
-- รัน SQL นี้ใน Supabase SQL Editor

-- 1. ลบตารางเดิม (ถ้ามี)
DROP TABLE IF EXISTS view_events CASCADE;
DROP TABLE IF EXISTS ai_edugame CASCADE;

-- 2. ลบ ENUM types เดิม (ถ้ามี)
DROP TYPE IF EXISTS category_enum CASCADE;
DROP TYPE IF EXISTS media_status_enum CASCADE;

-- 3. สร้าง ENUM types ใหม่
CREATE TYPE category_enum AS ENUM ('GAME', 'SCIENCE', 'MATH', 'THAI', 'ENGLISH', 'SOCIAL', 'OTHER');
CREATE TYPE media_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- 4. สร้างตาราง ai_edugame ใหม่
CREATE TABLE ai_edugame (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  category category_enum NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  status media_status_enum NOT NULL DEFAULT 'PENDING',
  submitted_by TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  play_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. สร้างตาราง view_events
CREATE TABLE view_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  media_id TEXT NOT NULL REFERENCES ai_edugame(id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 6. สร้าง indexes
CREATE INDEX idx_ai_edugame_status ON ai_edugame(status);
CREATE INDEX idx_ai_edugame_category ON ai_edugame(category);
CREATE INDEX idx_ai_edugame_view_count ON ai_edugame(view_count DESC);
CREATE INDEX idx_ai_edugame_created_at ON ai_edugame(created_at DESC);

CREATE INDEX idx_view_events_media_id ON view_events(media_id);
CREATE INDEX idx_view_events_ip_created ON view_events(ip_hash, created_at);

-- 7. สร้าง trigger สำหรับ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_edugame_updated_at
  BEFORE UPDATE ON ai_edugame
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE ai_edugame ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_events ENABLE ROW LEVEL SECURITY;

-- 9. สร้าง RLS policies
-- อนุญาตให้ทุกคนอ่านสื่อที่ APPROVED
CREATE POLICY "Allow public read approved media"
  ON ai_edugame FOR SELECT
  USING (status = 'APPROVED');

-- อนุญาตให้ทุกคนส่งสื่อใหม่ (INSERT)
CREATE POLICY "Allow public insert media"
  ON ai_edugame FOR INSERT
  WITH CHECK (true);

-- อนุญาตให้ service_role (admin) ทำได้ทุกอย่าง
CREATE POLICY "Allow service role full access"
  ON ai_edugame FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- อนุญาตให้ anon key ทำได้ทุกอย่าง (สำหรับ admin app)
CREATE POLICY "Allow anon full access"
  ON ai_edugame FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Policies สำหรับ view_events
CREATE POLICY "Allow public insert view events"
  ON view_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read view events"
  ON view_events FOR SELECT
  USING (true);

-- 10. Insert ข้อมูลตัวอย่าง
INSERT INTO ai_edugame (id, slug, title, url, thumbnail, description, category, tags, status, submitted_by)
VALUES
  ('sample-1', 'game-math-basic', 'เกมบวกเลขพื้นฐาน', 'https://loveable.dev/projects/game-math',
   'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400',
   'เกมฝึกบวกเลขสำหรับเด็กประถม', 'MATH', '["เกม","คณิตศาสตร์","ประถม"]', 'APPROVED', 'ครูสมชาย'),

  ('sample-2', 'science-solar-system', 'ระบบสุริยะ', 'https://loveable.dev/projects/solar-system',
   'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400',
   'เรียนรู้เกี่ยวกับดวงดาวในระบบสุริยะ', 'SCIENCE', '["วิทยาศาสตร์","อวกาศ"]', 'APPROVED', 'ครูสมหญิง'),

  ('sample-3', 'thai-alphabet', 'เกมจับคู่อักษรไทย', 'https://loveable.dev/projects/thai-alphabet',
   'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
   'ฝึกจำอักษรไทยผ่านเกมจับคู่', 'THAI', '["ภาษาไทย","อักษร","เกม"]', 'APPROVED', 'ครูวิไล'),

  ('sample-4', 'english-vocabulary', 'English Vocabulary Builder', 'https://loveable.dev/projects/vocab',
   'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
   'เกมฝึกคำศัพท์ภาษาอังกฤษ', 'ENGLISH', '["ภาษาอังกฤษ","คำศัพท์"]', 'APPROVED', 'Teacher John'),

  ('sample-5', 'social-thailand-map', 'แผนที่ประเทศไทย', 'https://loveable.dev/projects/thailand-map',
   'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
   'เรียนรู้จังหวัดต่างๆ ในประเทศไทย', 'SOCIAL', '["สังคม","ภูมิศาสตร์","ไทย"]', 'APPROVED', 'ครูประยุทธ');

-- 11. แสดงสรุป
SELECT
  'ai_edugame' as table_name,
  COUNT(*) as row_count
FROM ai_edugame
UNION ALL
SELECT
  'view_events' as table_name,
  COUNT(*) as row_count
FROM view_events;

-- แสดงโครงสร้างตาราง
SELECT
  column_name,
  data_type,
  udt_name,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'ai_edugame'
ORDER BY ordinal_position;

-- แสดงข้อมูลตัวอย่าง
SELECT id, slug, title, category, status, submitted_by, created_at
FROM ai_edugame
ORDER BY created_at DESC;

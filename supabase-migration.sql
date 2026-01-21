-- Migration SQL for ai_edugame table in Supabase
-- สร้างตารางและ columns ตามโครงสร้างของระบบ

-- 1. สร้าง ENUM types
CREATE TYPE category_enum AS ENUM ('GAME', 'SCIENCE', 'MATH', 'THAI', 'ENGLISH', 'SOCIAL', 'OTHER');
CREATE TYPE media_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- 2. สร้างตาราง ai_edugame (ถ้ายังไม่มี)
CREATE TABLE IF NOT EXISTS ai_edugame (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  category category_enum NOT NULL,
  tags TEXT NOT NULL, -- JSON string array
  status media_status_enum NOT NULL DEFAULT 'PENDING',
  submitted_by TEXT, -- ชื่อผู้ส่งสื่อ
  view_count INTEGER NOT NULL DEFAULT 0,
  play_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. สร้าง indexes สำหรับ performance
CREATE INDEX IF NOT EXISTS idx_ai_edugame_status ON ai_edugame(status);
CREATE INDEX IF NOT EXISTS idx_ai_edugame_category ON ai_edugame(category);
CREATE INDEX IF NOT EXISTS idx_ai_edugame_created_at ON ai_edugame(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_edugame_view_count ON ai_edugame(view_count DESC);

-- 4. สร้างตาราง view_events สำหรับติดตามการดู
CREATE TABLE IF NOT EXISTS view_events (
  id TEXT PRIMARY KEY,
  media_id TEXT NOT NULL REFERENCES ai_edugame(id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_view_events_media_id ON view_events(media_id);
CREATE INDEX IF NOT EXISTS idx_view_events_ip_created ON view_events(ip_hash, created_at);

-- 5. สร้าง trigger สำหรับ updated_at
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

-- 6. Enable Row Level Security (RLS)
ALTER TABLE ai_edugame ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_events ENABLE ROW LEVEL SECURITY;

-- 7. สร้าง policies สำหรับการเข้าถึง
-- อนุญาตให้ทุกคนอ่านสื่อที่ APPROVED
CREATE POLICY "Allow public read approved media"
  ON ai_edugame FOR SELECT
  USING (status = 'APPROVED');

-- อนุญาตให้ทุกคนส่งสื่อใหม่ (INSERT)
CREATE POLICY "Allow public insert media"
  ON ai_edugame FOR INSERT
  WITH CHECK (true);

-- อนุญาตให้ admin update/delete (ต้องใช้ service_role key)
CREATE POLICY "Allow admin full access"
  ON ai_edugame FOR ALL
  USING (auth.role() = 'service_role');

-- อนุญาตให้ทุกคนบันทึก view events
CREATE POLICY "Allow public insert view events"
  ON view_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read view events"
  ON view_events FOR SELECT
  USING (true);

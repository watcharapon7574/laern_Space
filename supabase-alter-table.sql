-- ALTER TABLE script สำหรับเพิ่ม columns ในตาราง ai_edugame ที่มีอยู่แล้ว

-- 1. สร้าง ENUM types (ถ้ายังไม่มี)
DO $$ BEGIN
  CREATE TYPE media_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. เพิ่ม columns ใหม่ (ถ้ายังไม่มี)
-- status column
ALTER TABLE ai_edugame
ADD COLUMN IF NOT EXISTS status media_status_enum NOT NULL DEFAULT 'APPROVED';

-- submitted_by column
ALTER TABLE ai_edugame
ADD COLUMN IF NOT EXISTS submitted_by TEXT;

-- อัพเดท status ของข้อมูลเก่าให้เป็น APPROVED
UPDATE ai_edugame
SET status = 'APPROVED'
WHERE status IS NULL;

-- 3. สร้าง indexes (ถ้ายังไม่มี)
CREATE INDEX IF NOT EXISTS idx_ai_edugame_status ON ai_edugame(status);
CREATE INDEX IF NOT EXISTS idx_ai_edugame_category ON ai_edugame(category);
CREATE INDEX IF NOT EXISTS idx_ai_edugame_view_count ON ai_edugame(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_ai_edugame_created_at ON ai_edugame(created_at DESC);

-- 4. สร้าง trigger สำหรับ updated_at (ถ้ายังไม่มี)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ai_edugame_updated_at ON ai_edugame;
CREATE TRIGGER update_ai_edugame_updated_at
  BEFORE UPDATE ON ai_edugame
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. สร้างตาราง view_events (ถ้ายังไม่มี)
CREATE TABLE IF NOT EXISTS view_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  media_id TEXT NOT NULL REFERENCES ai_edugame(id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_view_events_media_id ON view_events(media_id);
CREATE INDEX IF NOT EXISTS idx_view_events_ip_created ON view_events(ip_hash, created_at);

-- 6. Enable Row Level Security
ALTER TABLE ai_edugame ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_events ENABLE ROW LEVEL SECURITY;

-- 7. ลบ policies เก่า (ถ้ามี)
DROP POLICY IF EXISTS "Allow public read approved media" ON ai_edugame;
DROP POLICY IF EXISTS "Allow public insert media" ON ai_edugame;
DROP POLICY IF EXISTS "Allow admin full access" ON ai_edugame;
DROP POLICY IF EXISTS "Allow public insert view events" ON view_events;
DROP POLICY IF EXISTS "Allow public read view events" ON view_events;

-- 8. สร้าง policies ใหม่
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

-- อนุญาตให้ anon key อัพเดทได้ทุกอย่าง (สำหรับ admin ที่ login ผ่าน JWT)
CREATE POLICY "Allow authenticated update"
  ON ai_edugame FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete"
  ON ai_edugame FOR DELETE
  USING (true);

-- Policies สำหรับ view_events
CREATE POLICY "Allow public insert view events"
  ON view_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read view events"
  ON view_events FOR SELECT
  USING (true);

-- 9. แสดงโครงสร้างตารางปัจจุบัน
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'ai_edugame'
ORDER BY ordinal_position;

-- Step 1: Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  css_class TEXT NOT NULL DEFAULT 'tag-color-1',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Step 2: Seed default categories
INSERT INTO categories (id, key, label, slug, color, css_class, sort_order) VALUES
  ('cat_game',    'GAME',    'เกม',           'game',    '#8b5cf6', 'tag-color-5', 1),
  ('cat_science', 'SCIENCE', 'วิทยาศาสตร์',    'science', '#22c55e', 'tag-color-6', 2),
  ('cat_math',    'MATH',    'คณิต',          'math',    '#3b82f6', 'tag-color-1', 3),
  ('cat_thai',    'THAI',    'ภาษาไทย',       'thai',    '#ef4444', 'tag-color-7', 4),
  ('cat_english', 'ENGLISH', 'ภาษาอังกฤษ',    'english', '#f97316', 'tag-color-4', 5),
  ('cat_social',  'SOCIAL',  'สังคม',          'social',  '#6366f1', 'tag-color-8', 6),
  ('cat_other',   'OTHER',   'อื่น ๆ',        'other',   '#14b8a6', 'tag-color-2', 7)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Add category_id column to ai_edugame
ALTER TABLE ai_edugame ADD COLUMN IF NOT EXISTS category_id TEXT;

-- Step 4: Populate category_id from existing category enum
UPDATE ai_edugame SET category_id = 'cat_' || LOWER(category::text) WHERE category_id IS NULL;

-- Step 5: Set NOT NULL and add foreign key
ALTER TABLE ai_edugame ALTER COLUMN category_id SET NOT NULL;

ALTER TABLE ai_edugame
  ADD CONSTRAINT fk_media_category
  FOREIGN KEY (category_id) REFERENCES categories(id);

-- Step 6: Drop old category column and enum
ALTER TABLE ai_edugame DROP COLUMN IF EXISTS category;
DROP TYPE IF EXISTS "Category";

-- Step 7: Create index on category_id
CREATE INDEX IF NOT EXISTS idx_ai_edugame_category_id ON ai_edugame(category_id);

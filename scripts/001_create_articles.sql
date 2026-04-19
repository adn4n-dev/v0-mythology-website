-- Create articles table for Anka Dergi
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'Genel',
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published articles
CREATE POLICY "Allow public read access to published articles" 
  ON articles FOR SELECT 
  USING (is_published = TRUE);

-- Allow all operations for authenticated users (admin)
CREATE POLICY "Allow all for service role" 
  ON articles FOR ALL 
  USING (TRUE)
  WITH CHECK (TRUE);

-- Insert default articles
INSERT INTO articles (title, description, image_url, slug, category, is_featured, is_published)
VALUES 
  (
    'Anka Kuşu Efsanesi',
    'Mitolojide yeniden doğuşun en güçlü sembollerinden biri olan Anka kuşunun hikayesi.',
    '/images/phoenix-fire.jpg',
    'anka-kusu-efsanesi',
    'Mitoloji',
    FALSE,
    TRUE
  ),
  (
    'Türk Mitolojisinin Sembolleri',
    'Türk kültüründe yerlan kutsal hayvanlar ve anlamları.',
    '/images/turkish-mythology.jpg',
    'turk-mitolojisinin-sembolleri',
    'Kültür',
    FALSE,
    TRUE
  ),
  (
    'Yunan Tanrıları',
    'Olimpos''un güçlü tanrıları ve insanlığa olan ilişkileri.',
    '/images/greek-temple.jpg',
    'yunan-tanrilari',
    'Mitoloji',
    FALSE,
    TRUE
  ),
  (
    'Mitolojide Yeniden Doğuşun Gücü',
    'Antik mitolojilerde yeniden doğuş teması ve modern yaşama yansımaları. Farklı kültürlerde ölümsüzlük arayışı ve ruhun dönüşümü üzerine derinlemesine bir inceleme.',
    '/images/phoenix-fire.jpg',
    'mitolojide-yeniden-dogusun-gucu',
    'Mitoloji',
    TRUE,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;

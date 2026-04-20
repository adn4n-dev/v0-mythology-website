-- Seed initial articles for Anka Dergi

INSERT INTO articles (title, description, content, slug, category, is_featured, is_published) VALUES
(
  'Anka Kuşu Efsanesi',
  'Mitolojide yeniden doğuşun sembolü olan Anka kuşunun tarihçesi ve anlamı',
  'Anka kuşu, Türk mitolojisinin en önemli sembollerinden biridir. Ateşten doğan ve ateşe dönen bu efsanevi kuş, yeniden doğuş ve sonsallığın simgesidir. Anka, sadece ölmez değildir; her yüz yılda bir ateşin içinde yanarak yeniden doğar. Bu döngü, hayatın sürekliliği ve umudu sembolize eder.',
  'anka-kusu-efsanesi',
  'Mitoloji',
  true,
  true
),
(
  'Türk Mitolojisinin Sembolleri',
  'Türk kültüründe yeralan kutsal hayvanlar ve anlamları',
  'Türk mitolojisi, sayısız sembolik hayvan ve figürle doludur. Her biri farklı anlamlar taşıyan bu semboller, kuşaktan kuşağa aktarılan değerlerimizin temelini oluşturur. Bozkurt gücü, kurt zekayı, kuş özgürlüğü sembolize ederken, ejderha kozmik enerjiyi temsil eder.',
  'turk-mitolojisinin-sembolleri',
  'Mitoloji',
  false,
  true
),
(
  'Yunan Tanrıları',
  'Olimpos'un güçlü tanrıları ve onların insanlar üzerindeki etkileri',
  'Antik Yunan medeniyeti, zengin bir tanrılar panteonunu yaratmıştır. Zeus, Athena, Apollo ve daha birçok tanrı, Yunanlıların hayatının her alanını şekillendirmiştir. Bu tanrılar sadece dini figürler değil, aynı zamanda insan doğasının ve evrenin temel kuvvetlerinin yansımalarıdır.',
  'yunan-tarilari',
  'Kültür',
  true,
  true
);

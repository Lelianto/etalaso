-- ============================================
-- 004_plan_templates.sql
-- Update Plan template allowances:
--   free    → minimal only (no template change)
--   umkm    → 5 curated templates (1 per layout)
--   business → all 150 templates
-- ============================================

-- Free: only minimal (cannot change template)
UPDATE "Plan" SET
  max_templates = '{minimal}',
  features = '["Halaman bisnis otomatis","Template dasar","Tombol WhatsApp"]'
WHERE id = 'free';

-- UMKM: 5 templates (1 per layout type for variety)
UPDATE "Plan" SET
  max_templates = '{minimal,std-minimal,split-sunset,app-ocean,gallery-elegant,cards-emerald}',
  features = '["Edit teks profil","Upload 5 foto produk","5 pilihan template","Tombol WhatsApp"]'
WHERE id = 'umkm';

-- Business: all 150 templates (6 legacy + 144 premium)
UPDATE "Plan" SET
  max_templates = '{minimal,warung,elegant,bold,card,glass,std-minimal,std-midnight,std-elegant,std-emerald,std-sunset,std-ocean,std-neo,std-business,std-nordic,std-luxury,std-industrial,std-organic,std-creative,std-retro,std-playful,std-candy,std-glass,std-cyberpunk,std-dark-elegant,std-dark-nordic,split-minimal,split-midnight,split-elegant,split-emerald,split-sunset,split-ocean,split-neo,split-business,split-nordic,split-luxury,split-industrial,split-organic,split-creative,split-retro,split-playful,split-candy,split-glass,split-cyberpunk,split-dark-elegant,split-dark-nordic,app-minimal,app-midnight,app-elegant,app-emerald,app-sunset,app-ocean,app-neo,app-business,app-nordic,app-luxury,app-industrial,app-organic,app-creative,app-retro,app-playful,app-candy,app-glass,app-cyberpunk,app-dark-elegant,app-dark-nordic,gallery-minimal,gallery-midnight,gallery-elegant,gallery-emerald,gallery-sunset,gallery-ocean,gallery-neo,gallery-business,gallery-nordic,gallery-luxury,gallery-industrial,gallery-organic,gallery-retro,gallery-candy,gallery-glass,gallery-cyberpunk,cards-minimal,cards-midnight,cards-elegant,cards-emerald,cards-sunset,cards-ocean,cards-neo,cards-business,cards-nordic,cards-luxury,cards-industrial,cards-organic,cards-creative,cards-retro,cards-playful,cards-candy,cards-glass,cards-cyberpunk,mag-minimal,mag-midnight,mag-elegant,mag-sunset,mag-ocean,mag-luxury,mag-business,mag-organic,mag-cyberpunk,mag-nordic,side-minimal,side-midnight,side-elegant,side-emerald,side-sunset,side-ocean,side-business,side-luxury,side-industrial,side-nordic,stack-minimal,stack-midnight,stack-elegant,stack-emerald,stack-sunset,stack-ocean,stack-neo,stack-luxury,stack-cyberpunk,stack-business,cmpct-minimal,cmpct-midnight,cmpct-sunset,cmpct-emerald,cmpct-ocean,cmpct-candy,cmpct-business,cmpct-organic,cmpct-glass,cmpct-playful,show-minimal,show-midnight,show-elegant,show-emerald,show-sunset,show-ocean,show-luxury,show-business,show-cyberpunk,show-creative}',
  features = '["Semua 150 template","Banner custom","20 foto produk","Subdomain .etalaso.id","Statistik pengunjung"]'
WHERE id = 'business';

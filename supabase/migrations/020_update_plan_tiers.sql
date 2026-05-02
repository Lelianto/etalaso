-- Migration 020: Update Plan Tiers and Template Access
-- This migration updates the template access limits for Free, UMKM, and Business plans.

-- 1. Update Free Plan (3 Templates)
UPDATE "Plan" SET
  max_templates = '{minimal,warung,kuliner}',
  features = '["Halaman bisnis otomatis","3 pilihan template","Tombol WhatsApp","3 produk/layanan"]'
WHERE id = 'free';

-- 2. Update UMKM Plan (15 Templates)
UPDATE "Plan" SET
  max_templates = '{minimal,warung,kuliner,modern,compact,visual_immersive,sf-cl-minimal,sf-cl-sunset,sf-cl-ocean,sf-cl-midnight,sf-md-minimal,sf-md-sunset,sf-cp-minimal,sf-cp-sunset,sf-vi-elegant}',
  features = '["Edit teks profil","Upload foto produk","15 pilihan template","Tombol WhatsApp","20 produk/layanan"]'
WHERE id = 'umkm';

-- 3. Update Business Plan (Full Access)
-- Includes new Bento (sf-bt-*) and Editorial (sf-ed-*) templates
UPDATE "Plan" SET
  max_templates = '{minimal,warung,elegant,bold,card,glass,std-minimal,std-midnight,std-elegant,std-emerald,std-sunset,std-ocean,std-neo,std-business,std-nordic,std-luxury,std-industrial,std-organic,std-creative,std-retro,std-playful,std-candy,std-glass,std-cyberpunk,std-dark-elegant,std-dark-nordic,split-minimal,split-midnight,split-elegant,split-emerald,split-sunset,split-ocean,split-neo,split-business,split-nordic,split-luxury,split-industrial,split-organic,split-creative,split-retro,split-playful,split-candy,split-glass,split-cyberpunk,split-dark-elegant,split-dark-nordic,app-minimal,app-midnight,app-elegant,app-emerald,app-sunset,app-ocean,app-neo,app-business,app-nordic,app-luxury,app-industrial,app-organic,app-creative,app-retro,app-playful,app-candy,app-glass,app-cyberpunk,app-dark-elegant,app-dark-nordic,gallery-minimal,gallery-midnight,gallery-elegant,gallery-emerald,gallery-sunset,gallery-ocean,gallery-neo,gallery-business,gallery-nordic,gallery-luxury,gallery-industrial,gallery-organic,gallery-retro,gallery-candy,gallery-glass,gallery-cyberpunk,cards-minimal,cards-midnight,cards-elegant,cards-emerald,cards-sunset,cards-ocean,cards-neo,cards-business,cards-nordic,cards-luxury,cards-industrial,cards-organic,cards-creative,cards-retro,cards-playful,cards-candy,cards-glass,cards-cyberpunk,mag-minimal,mag-midnight,mag-elegant,mag-sunset,mag-ocean,mag-luxury,mag-business,mag-organic,mag-cyberpunk,mag-nordic,side-minimal,side-midnight,side-elegant,side-emerald,side-sunset,side-ocean,side-business,side-luxury,side-industrial,side-nordic,stack-minimal,stack-midnight,stack-elegant,stack-emerald,stack-sunset,stack-ocean,stack-neo,stack-luxury,stack-cyberpunk,stack-business,cmpct-minimal,cmpct-midnight,cmpct-sunset,cmpct-emerald,cmpct-ocean,cmpct-candy,cmpct-business,cmpct-organic,cmpct-glass,cmpct-playful,show-minimal,show-midnight,show-elegant,show-emerald,show-sunset,show-ocean,show-luxury,show-business,show-cyberpunk,show-creative,sf-vi-minimal,sf-vi-midnight,sf-vi-elegant,sf-bt-modern,sf-bt-midnight,sf-bt-playful,sf-ed-luxury,sf-ed-minimal}',
  features = '["Semua 150+ template","Banner custom","50 produk/layanan","Subdomain .etalaso.id","Statistik pengunjung"]'
WHERE id = 'business';

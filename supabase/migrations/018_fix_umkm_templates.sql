-- ============================================
-- 017_fix_umkm_templates.sql
-- Fix UMKM template access - ensure they have 6 templates
-- ============================================

UPDATE "Plan" SET
  max_templates = '{minimal,std-minimal,split-sunset,app-ocean,gallery-elegant,cards-emerald}'
WHERE id = 'umkm';
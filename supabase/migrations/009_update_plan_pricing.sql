-- ============================================
-- 009_update_plan_pricing.sql
-- Update pricing: UMKM 15000 → 29000, Business 59000 → 79000
-- ============================================

UPDATE "Plan" SET price = 29000 WHERE id = 'umkm';
UPDATE "Plan" SET price = 79000 WHERE id = 'business';

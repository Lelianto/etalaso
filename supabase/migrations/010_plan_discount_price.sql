-- ============================================
-- 010_plan_discount_price.sql
-- Add discountPrice column to Plan for configurable promo pricing
-- ============================================

ALTER TABLE "Plan" ADD COLUMN IF NOT EXISTS "discountPrice" INTEGER DEFAULT NULL;

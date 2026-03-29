-- ============================================
-- 007_subscription_expiry.sql
-- Subscription expiry: pg_cron downgrade + sync subscriptionType
-- ============================================

-- Add subscriptionType column to Business (mirrors UserProfile.planId for public page reads)
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "subscriptionType" TEXT DEFAULT 'free';

-- ─── Function: downgrade expired subscriptions ─────────────────
CREATE OR REPLACE FUNCTION downgrade_expired_subscriptions()
RETURNS void AS $$
BEGIN
  -- 1. Reset Business.subscriptionType and template for expired users
  UPDATE "Business" b
  SET
    "subscriptionType" = 'free',
    template = 'minimal',
    "updatedAt" = now()
  FROM "UserProfile" up
  WHERE b."ownerId" = up.id
    AND up."planExpiresAt" IS NOT NULL
    AND up."planExpiresAt" < now()
    AND up."planId" != 'free';

  -- 2. Downgrade UserProfile to free
  UPDATE "UserProfile"
  SET "planId" = 'free'
  WHERE "planExpiresAt" IS NOT NULL
    AND "planExpiresAt" < now()
    AND "planId" != 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── pg_cron: run daily at 00:05 UTC ──────────────────────────
-- NOTE: pg_cron must be enabled in Supabase Dashboard > Database > Extensions
-- Run this after enabling the extension:
--
-- SELECT cron.schedule(
--   'downgrade-expired-subscriptions',
--   '5 0 * * *',
--   $$ SELECT downgrade_expired_subscriptions(); $$
-- );

-- ─── Function: sync subscriptionType when UserProfile.planId changes ───
CREATE OR REPLACE FUNCTION sync_subscription_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."planId" IS DISTINCT FROM OLD."planId" THEN
    UPDATE "Business"
    SET
      "subscriptionType" = NEW."planId",
      template = CASE
        WHEN NEW."planId" = 'free' THEN 'minimal'
        ELSE template
      END,
      "updatedAt" = now()
    WHERE "ownerId" = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_plan_change ON "UserProfile";
CREATE TRIGGER on_plan_change
  AFTER UPDATE ON "UserProfile"
  FOR EACH ROW EXECUTE FUNCTION sync_subscription_type();

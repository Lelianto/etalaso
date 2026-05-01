-- ============================================
-- 016_fix_business_ownerid_uuid.sql
-- Fix Business.ownerId type mismatch between text and uuid
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Business'
      AND column_name = 'ownerId'
      AND data_type = 'text'
  ) THEN
    -- Clean invalid ownerId values before casting
    UPDATE "Business"
    SET "ownerId" = NULL
    WHERE "ownerId" IS NOT NULL
      AND "ownerId" !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

    DROP POLICY IF EXISTS "Owner update own business" ON "Business";
    DROP POLICY IF EXISTS "Owner insert own products" ON "Product";
    DROP POLICY IF EXISTS "Owner update own products" ON "Product";
    DROP POLICY IF EXISTS "Owner delete own products" ON "Product";
    DROP POLICY IF EXISTS "Owner read own analytics" ON "Analytics";

    ALTER TABLE "Business" DROP CONSTRAINT IF EXISTS business_ownerid_fkey;
    ALTER TABLE "Business"
      ALTER COLUMN "ownerId" TYPE uuid USING NULLIF(trim("ownerId"), '')::uuid;
    ALTER TABLE "Business"
      ADD CONSTRAINT business_ownerid_fkey FOREIGN KEY ("ownerId") REFERENCES auth.users(id);

    CREATE POLICY "Owner update own business"
      ON "Business" FOR UPDATE
      USING (auth.uid()::uuid = "ownerId");

    CREATE POLICY "Owner insert own products"
      ON "Product" FOR INSERT
      WITH CHECK (EXISTS (
        SELECT 1 FROM "Business"
        WHERE "Business".id = "Product"."businessId"
          AND "Business"."ownerId"::text = auth.uid()::text
      ));

    CREATE POLICY "Owner update own products"
      ON "Product" FOR UPDATE
      USING (EXISTS (
        SELECT 1 FROM "Business"
        WHERE "Business".id = "Product"."businessId"
          AND "Business"."ownerId"::text = auth.uid()::text
      ));

    CREATE POLICY "Owner delete own products"
      ON "Product" FOR DELETE
      USING (EXISTS (
        SELECT 1 FROM "Business"
        WHERE "Business".id = "Product"."businessId"
          AND "Business"."ownerId"::text = auth.uid()::text
      ));

    CREATE POLICY "Owner read own analytics"
      ON "Analytics" FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM "Business"
        WHERE "Business".id = "Analytics"."businessId"
          AND "Business"."ownerId"::text = auth.uid()::text
      ));
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 003_rls_write_policies.sql
-- Secure write access for Business and Product
-- ============================================

-- Business: owner can update their own business
CREATE POLICY "Owner update own business"
ON "Business" FOR UPDATE
USING (auth.uid()::text = "ownerId"::text);

-- Product: owner can insert products for their business
CREATE POLICY "Owner insert own products"
ON "Product" FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM "Business"
  WHERE "Business".id = "Product"."businessId"
  AND "Business"."ownerId"::text = auth.uid()::text
));

-- Product: owner can update their business products
CREATE POLICY "Owner update own products"
ON "Product" FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM "Business"
  WHERE "Business".id = "Product"."businessId"
  AND "Business"."ownerId"::text = auth.uid()::text
));

-- Product: owner can delete their business products
CREATE POLICY "Owner delete own products"
ON "Product" FOR DELETE
USING (EXISTS (
  SELECT 1 FROM "Business"
  WHERE "Business".id = "Product"."businessId"
  AND "Business"."ownerId"::text = auth.uid()::text
));

-- Analytics: restrict read to business owner only (paid feature)
DROP POLICY IF EXISTS "Public read Analytics" ON "Analytics";
CREATE POLICY "Owner read own analytics"
ON "Analytics" FOR SELECT
USING (EXISTS (
  SELECT 1 FROM "Business"
  WHERE "Business".id = "Analytics"."businessId"
  AND "Business"."ownerId"::text = auth.uid()::text
));
-- Keep service role full access (already exists from migration 002)

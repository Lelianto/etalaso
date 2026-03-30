-- Kuliner Rumahan feature: new columns and tables

-- Business: new fields for kuliner rumahan
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "businessType" TEXT DEFAULT 'directory';
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "tagline" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "areaNote" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "deliveryMethods" TEXT[] DEFAULT '{}';
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "operatingDays" TEXT[] DEFAULT '{}';
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "defaultSubcategory" TEXT;

-- Product: subcategory and availability
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "subcategory" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "availabilityNote" TEXT;

-- Subcategory request table
CREATE TABLE IF NOT EXISTS "SubcategoryRequest" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES auth.users(id),
  "businessId" TEXT NOT NULL REFERENCES "Business"(id),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "reviewedAt" TIMESTAMPTZ
);

-- RLS for SubcategoryRequest
ALTER TABLE "SubcategoryRequest" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own subcategory requests"
  ON "SubcategoryRequest" FOR INSERT
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can view their own subcategory requests"
  ON "SubcategoryRequest" FOR SELECT
  USING (auth.uid() = "userId");

-- Index for admin queries
CREATE INDEX IF NOT EXISTS idx_subcategory_request_status ON "SubcategoryRequest"("status");

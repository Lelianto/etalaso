-- ============================================
-- PENDING MIGRATIONS: 011 - 014
-- Jalankan di Supabase SQL Editor (production)
-- ============================================

-- ============================================
-- 011: Kuliner Rumahan
-- ============================================
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "businessType" TEXT DEFAULT 'directory';
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "tagline" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "areaNote" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "deliveryMethods" TEXT[] DEFAULT '{}';
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "operatingDays" TEXT[] DEFAULT '{}';
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "defaultSubcategory" TEXT;

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "subcategory" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "availabilityNote" TEXT;

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

ALTER TABLE "SubcategoryRequest" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own subcategory requests"
    ON "SubcategoryRequest" FOR INSERT
    WITH CHECK (auth.uid() = "userId");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view their own subcategory requests"
    ON "SubcategoryRequest" FOR SELECT
    USING (auth.uid() = "userId");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_subcategory_request_status ON "SubcategoryRequest"("status");

-- ============================================
-- 012: Free Tier Products
-- ============================================
UPDATE "Plan" SET
  max_products = 3,
  features = '["Halaman bisnis otomatis","Template dasar","Tombol WhatsApp","3 produk/layanan"]'
WHERE id = 'free';

UPDATE "Plan" SET
  max_products = 20,
  features = '["Edit teks profil","Upload foto produk","6 pilihan template","Tombol WhatsApp","20 produk/layanan"]'
WHERE id = 'umkm';

UPDATE "Plan" SET
  max_products = 50,
  features = '["Semua 150+ template","Banner custom","50 produk/layanan","Subdomain .etalaso.id","Statistik pengunjung"]'
WHERE id = 'business';

-- ============================================
-- 013: Product Images Storage
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "Auth users upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read product images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Auth users delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- 014: Custom Slug
-- ============================================
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "customSlug" TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_business_custom_slug ON "Business" ("customSlug") WHERE "customSlug" IS NOT NULL;

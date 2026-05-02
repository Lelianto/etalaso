-- ============================================
-- PENDING MIGRATIONS: 011 - 017
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
  max_templates = '{minimal,warung,kuliner}',
  features = '["Halaman bisnis otomatis","3 pilihan template","Tombol WhatsApp","3 produk/layanan"]'
WHERE id = 'free';

UPDATE "Plan" SET
  max_products = 20,
  max_templates = '{minimal,std-minimal,split-sunset,app-ocean,gallery-elegant,cards-emerald}',
  features = '["Edit teks profil","Upload foto produk","15 pilihan template","Tombol WhatsApp","20 produk/layanan"]'
WHERE id = 'umkm';

UPDATE "Plan" SET
  max_products = 50,
  max_templates = '{minimal,warung,elegant,bold,card,glass,std-minimal,std-midnight,std-elegant,std-emerald,std-sunset,std-ocean,std-neo,std-business,std-nordic,std-luxury,std-industrial,std-organic,std-creative,std-retro,std-playful,std-candy,std-glass,std-cyberpunk,std-dark-elegant,std-dark-nordic,split-minimal,split-midnight,split-elegant,split-emerald,split-sunset,split-ocean,split-neo,split-business,split-nordic,split-luxury,split-industrial,split-organic,split-creative,split-retro,split-playful,split-candy,split-glass,split-cyberpunk,split-dark-elegant,split-dark-nordic,app-minimal,app-midnight,app-elegant,app-emerald,app-sunset,app-ocean,app-neo,app-business,app-nordic,app-luxury,app-industrial,app-organic,app-creative,app-retro,app-playful,app-candy,app-glass,app-cyberpunk,app-dark-elegant,app-dark-nordic,gallery-minimal,gallery-midnight,gallery-elegant,gallery-emerald,gallery-sunset,gallery-ocean,gallery-neo,gallery-business,gallery-nordic,gallery-luxury,gallery-industrial,gallery-organic,gallery-retro,gallery-candy,gallery-glass,gallery-cyberpunk,cards-minimal,cards-midnight,cards-elegant,cards-emerald,cards-sunset,cards-ocean,cards-neo,cards-business,cards-nordic,cards-luxury,cards-industrial,cards-organic,cards-creative,cards-retro,cards-playful,cards-candy,cards-glass,cards-cyberpunk,mag-minimal,mag-midnight,mag-elegant,mag-sunset,mag-ocean,mag-luxury,mag-business,mag-organic,mag-cyberpunk,mag-nordic,side-minimal,side-midnight,side-elegant,side-emerald,side-sunset,side-ocean,side-business,side-luxury,side-industrial,side-nordic,stack-minimal,stack-midnight,stack-elegant,stack-emerald,stack-sunset,stack-ocean,stack-neo,stack-luxury,stack-cyberpunk,stack-business,cmpct-minimal,cmpct-midnight,cmpct-sunset,cmpct-emerald,cmpct-ocean,cmpct-candy,cmpct-business,cmpct-organic,cmpct-glass,cmpct-playful,show-minimal,show-midnight,show-elegant,show-emerald,show-sunset,show-ocean,show-luxury,show-business,show-cyberpunk,show-creative,sf-vi-minimal,sf-vi-midnight,sf-vi-elegant,sf-bt-modern,sf-bt-midnight,sf-bt-playful,sf-ed-luxury,sf-ed-minimal}',
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

-- ============================================
-- 017: Fix UMKM Templates
-- ============================================
UPDATE "Plan" SET
  max_templates = '{minimal,std-minimal,split-sunset,app-ocean,gallery-elegant,cards-emerald}'
WHERE id = 'umkm';

-- ============================================
-- 019: Add Business Visibility
-- ============================================
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT true;
UPDATE "Business" SET "isPublic" = true WHERE "isPublic" IS NULL;

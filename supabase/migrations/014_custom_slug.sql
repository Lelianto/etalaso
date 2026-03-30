-- Custom slug for prettier URLs (UMKM+ tier feature)
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "customSlug" TEXT UNIQUE;

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_business_custom_slug ON "Business" ("customSlug") WHERE "customSlug" IS NOT NULL;

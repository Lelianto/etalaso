-- ============================================
-- 001_initial_schema.sql
-- Tables: Business, Product, Review, User, Claim
-- ============================================

-- Business (scraped from Google Maps + customization fields)
CREATE TABLE "Business" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "placeId"     TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  address       TEXT,
  "mapsUrl"     TEXT,
  category      TEXT,
  kecamatan     TEXT,
  region        TEXT,
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  "googleTypes" TEXT,

  -- Customization (paid/claimed)
  "isClaimed"       BOOLEAN DEFAULT false,
  "ownerId"         TEXT,
  template          TEXT DEFAULT 'minimal',
  description       TEXT,
  "openingHours"    TEXT,
  "whatsappNumber"  TEXT,
  "whatsappMessage" TEXT,
  "brandingEnabled" BOOLEAN DEFAULT true,

  "createdAt"   TIMESTAMPTZ DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_business_kecamatan_category ON "Business" (kecamatan, category);

-- Product
CREATE TABLE "Product" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name          TEXT NOT NULL,
  description   TEXT,
  price         TEXT,
  "imageUrl"    TEXT,
  "businessId"  TEXT NOT NULL REFERENCES "Business"(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_business ON "Product" ("businessId");

-- Review
CREATE TABLE "Review" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  author        TEXT NOT NULL,
  rating        INTEGER DEFAULT 5,
  text          TEXT,
  date          TEXT,
  "businessId"  TEXT NOT NULL REFERENCES "Business"(id) ON DELETE CASCADE
);

CREATE INDEX idx_review_business ON "Review" ("businessId");

-- User
CREATE TABLE "User" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  password      TEXT NOT NULL,
  "createdAt"   TIMESTAMPTZ DEFAULT now()
);

-- Claim
CREATE TABLE "Claim" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "businessId"  TEXT NOT NULL REFERENCES "Business"(id) ON DELETE CASCADE,
  "userId"      TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'PENDING',  -- PENDING, VERIFIED, REJECTED
  "proofUrl"    TEXT,
  "createdAt"   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_claim_business ON "Claim" ("businessId");
CREATE INDEX idx_claim_user ON "Claim" ("userId");

-- Enable RLS
ALTER TABLE "Business" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Claim"    ENABLE ROW LEVEL SECURITY;

-- Public read access for Business, Product, Review (for the public pages)
CREATE POLICY "Public read Business" ON "Business" FOR SELECT USING (true);
CREATE POLICY "Public read Product"  ON "Product"  FOR SELECT USING (true);
CREATE POLICY "Public read Review"   ON "Review"   FOR SELECT USING (true);

-- Service role full access (for import scripts)
CREATE POLICY "Service full Business" ON "Business" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full Product"  ON "Product"  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full Review"   ON "Review"   FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full User"     ON "User"     FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full Claim"    ON "Claim"    FOR ALL USING (auth.role() = 'service_role');

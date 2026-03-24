-- ============================================
-- 002_etalaso_mvp.sql
-- Auth, Plans, Payments, Analytics, Subdomain
-- ============================================

-- Drop old User table (we'll use Supabase Auth instead)
DROP TABLE IF EXISTS "Claim" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- ─── Plans ──────────────────────────────────────────────────
CREATE TABLE "Plan" (
  id          TEXT PRIMARY KEY,  -- 'free', 'umkm', 'business'
  name        TEXT NOT NULL,
  price       INTEGER NOT NULL DEFAULT 0,  -- in IDR, 0 = free
  features    JSONB NOT NULL DEFAULT '[]',
  max_products INTEGER NOT NULL DEFAULT 0,
  max_templates TEXT[] NOT NULL DEFAULT '{}',
  has_analytics BOOLEAN DEFAULT false,
  has_subdomain BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Seed plans
INSERT INTO "Plan" (id, name, price, features, max_products, max_templates, has_analytics, has_subdomain) VALUES
  ('free', 'Gratis', 0, '["Halaman bisnis otomatis","Template dasar","Tombol WhatsApp"]', 0, '{minimal}', false, false),
  ('umkm', 'UMKM', 15000, '["Edit teks profil","Upload 5 foto produk","3 pilihan template","Tombol WhatsApp"]', 5, '{minimal,warung,card}', false, false),
  ('business', 'Business', 59000, '["Semua template","Banner custom","20 foto produk","Subdomain .etalaso.id","Statistik pengunjung"]', 20, '{minimal,warung,card,elegant,bold,glass}', true, true);

-- ─── User Profile (linked to Supabase Auth) ─────────────────
CREATE TABLE "UserProfile" (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  name        TEXT,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'user',  -- 'user' or 'admin'
  "planId"    TEXT REFERENCES "Plan"(id) DEFAULT 'free',
  "planExpiresAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- ─── Claims (updated) ────────────────────────────────────────
CREATE TABLE "Claim" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "businessId" TEXT NOT NULL REFERENCES "Business"(id) ON DELETE CASCADE,
  "userId"    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'pending',  -- pending, approved, rejected
  message     TEXT,  -- optional message from claimant
  "adminNote" TEXT,  -- admin rejection reason
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_claim_business ON "Claim" ("businessId");
CREATE INDEX idx_claim_user ON "Claim" ("userId");
CREATE INDEX idx_claim_status ON "Claim" (status);

-- ─── Payments ────────────────────────────────────────────────
CREATE TABLE "Payment" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "planId"    TEXT NOT NULL REFERENCES "Plan"(id),
  amount      INTEGER NOT NULL,  -- IDR
  proof_url   TEXT,  -- screenshot upload URL
  status      TEXT DEFAULT 'pending',  -- pending, verified, rejected
  "adminNote" TEXT,
  "verifiedBy" UUID REFERENCES auth.users(id),
  "verifiedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payment_user ON "Payment" ("userId");
CREATE INDEX idx_payment_status ON "Payment" (status);

-- ─── Analytics (daily aggregates) ────────────────────────────
CREATE TABLE "Analytics" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "businessId" TEXT NOT NULL REFERENCES "Business"(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  page_views  INTEGER DEFAULT 0,
  wa_clicks   INTEGER DEFAULT 0,
  UNIQUE("businessId", date)
);

CREATE INDEX idx_analytics_business_date ON "Analytics" ("businessId", date);

-- ─── Subdomain ───────────────────────────────────────────────
CREATE TABLE "Subdomain" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "businessId" TEXT UNIQUE NOT NULL REFERENCES "Business"(id) ON DELETE CASCADE,
  subdomain   TEXT UNIQUE NOT NULL,  -- e.g. 'sambalado' → sambalado.etalaso.id
  status      TEXT DEFAULT 'pending',  -- pending, active, rejected
  "requestedBy" UUID NOT NULL REFERENCES auth.users(id),
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subdomain_name ON "Subdomain" (subdomain);

-- ─── Update Business table ───────────────────────────────────
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "ownerId" UUID REFERENCES auth.users(id);
-- Drop old text ownerId if exists and re-add as UUID
-- (skip if already UUID — Supabase will handle this)

-- ─── RLS Policies ────────────────────────────────────────────

-- UserProfile
ALTER TABLE "UserProfile" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON "UserProfile" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON "UserProfile" FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service full UserProfile" ON "UserProfile" FOR ALL USING (auth.role() = 'service_role');
-- Allow insert for new users (trigger will handle this)
CREATE POLICY "Users insert own profile" ON "UserProfile" FOR INSERT WITH CHECK (auth.uid() = id);

-- Plan (public read)
ALTER TABLE "Plan" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read Plan" ON "Plan" FOR SELECT USING (true);
CREATE POLICY "Service full Plan" ON "Plan" FOR ALL USING (auth.role() = 'service_role');

-- Claim
ALTER TABLE "Claim" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own claims" ON "Claim" FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users create claims" ON "Claim" FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Service full Claim" ON "Claim" FOR ALL USING (auth.role() = 'service_role');

-- Payment
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own payments" ON "Payment" FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users create payments" ON "Payment" FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Service full Payment" ON "Payment" FOR ALL USING (auth.role() = 'service_role');

-- Analytics (public read for business owner)
ALTER TABLE "Analytics" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read Analytics" ON "Analytics" FOR SELECT USING (true);
CREATE POLICY "Service full Analytics" ON "Analytics" FOR ALL USING (auth.role() = 'service_role');

-- Subdomain
ALTER TABLE "Subdomain" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read Subdomain" ON "Subdomain" FOR SELECT USING (true);
CREATE POLICY "Users create subdomain" ON "Subdomain" FOR INSERT WITH CHECK (auth.uid() = "requestedBy");
CREATE POLICY "Service full Subdomain" ON "Subdomain" FOR ALL USING (auth.role() = 'service_role');

-- ─── Auto-create UserProfile on signup ───────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "UserProfile" (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: runs after Supabase Auth creates a user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

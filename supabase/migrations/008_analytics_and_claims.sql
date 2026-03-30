-- Analytics: page views tracking
-- Business.id is TEXT, so business_id must also be TEXT
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES "Business"(id) ON DELETE CASCADE,
  path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_views_business ON page_views(business_id);
CREATE INDEX idx_page_views_created ON page_views(created_at);
CREATE INDEX idx_page_views_business_created ON page_views(business_id, created_at);

-- Analytics: WhatsApp click tracking
CREATE TABLE IF NOT EXISTS wa_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES "Business"(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wa_clicks_business ON wa_clicks(business_id);
CREATE INDEX idx_wa_clicks_created ON wa_clicks(created_at);
CREATE INDEX idx_wa_clicks_business_created ON wa_clicks(business_id, created_at);

-- Reports: user-submitted reports for business pages
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES "Business"(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_business ON reports(business_id);
CREATE INDEX idx_reports_status ON reports(status);

-- Add new columns to Business table for claim features
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "claimedAt" TIMESTAMPTZ;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "originalData" JSONB;

-- RLS: page_views and wa_clicks are insert-only from API (service role)
-- No user-facing RLS needed since we use supabaseAdmin for these tables
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (already implied, but explicit)
CREATE POLICY "service_role_all_page_views" ON page_views FOR ALL USING (true);
CREATE POLICY "service_role_all_wa_clicks" ON wa_clicks FOR ALL USING (true);
CREATE POLICY "service_role_all_reports" ON reports FOR ALL USING (true);

-- Fix overly permissive RLS policies on analytics tables.
-- The old policies used USING(true) without role qualifier, allowing anon SELECT.
-- Replace with service_role-only policies.

DROP POLICY IF EXISTS "service_role_all_page_views" ON page_views;
DROP POLICY IF EXISTS "service_role_all_wa_clicks" ON wa_clicks;
DROP POLICY IF EXISTS "service_role_all_reports" ON reports;

-- Only service_role (used by supabaseAdmin) can access these tables
CREATE POLICY "service_role_page_views" ON page_views FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_wa_clicks" ON wa_clicks FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_reports" ON reports FOR ALL TO service_role USING (true);

-- CMS VISUAL PARA IGREJAS — POLÍTICAS DE ROW-LEVEL SECURITY (RLS)
-- Fase 57: Fundação de Isolamento Multi-tenant no Banco de Dados
-- Garante isolamento físico por congregação via tenant_id

-- 1. users
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_users_tenant_isolation" ON "users";
CREATE POLICY "policy_users_tenant_isolation" ON "users"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 2. site_settings
ALTER TABLE "site_settings" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_site_settings_tenant_isolation" ON "site_settings";
CREATE POLICY "policy_site_settings_tenant_isolation" ON "site_settings"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 3. institutional_contents
ALTER TABLE "institutional_contents" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_institutional_contents_tenant_isolation" ON "institutional_contents";
CREATE POLICY "policy_institutional_contents_tenant_isolation" ON "institutional_contents"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 4. site_publication_settings
ALTER TABLE "site_publication_settings" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_site_publication_settings_tenant_isolation" ON "site_publication_settings";
CREATE POLICY "policy_site_publication_settings_tenant_isolation" ON "site_publication_settings"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 5. site_analytics
ALTER TABLE "site_analytics" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_site_analytics_tenant_isolation" ON "site_analytics";
CREATE POLICY "policy_site_analytics_tenant_isolation" ON "site_analytics"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 6. visual_themes
ALTER TABLE "visual_themes" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_visual_themes_tenant_isolation" ON "visual_themes";
CREATE POLICY "policy_visual_themes_tenant_isolation" ON "visual_themes"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 7. pages
ALTER TABLE "pages" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_pages_tenant_isolation" ON "pages";
CREATE POLICY "policy_pages_tenant_isolation" ON "pages"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 8. page_sections
ALTER TABLE "page_sections" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_page_sections_tenant_isolation" ON "page_sections";
CREATE POLICY "policy_page_sections_tenant_isolation" ON "page_sections"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 9. page_blocks
ALTER TABLE "page_blocks" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_page_blocks_tenant_isolation" ON "page_blocks";
CREATE POLICY "policy_page_blocks_tenant_isolation" ON "page_blocks"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 10. navigation_menus
ALTER TABLE "navigation_menus" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_navigation_menus_tenant_isolation" ON "navigation_menus";
CREATE POLICY "policy_navigation_menus_tenant_isolation" ON "navigation_menus"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 11. media_items
ALTER TABLE "media_items" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_media_items_tenant_isolation" ON "media_items";
CREATE POLICY "policy_media_items_tenant_isolation" ON "media_items"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 12. church_schedules
ALTER TABLE "church_schedules" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_church_schedules_tenant_isolation" ON "church_schedules";
CREATE POLICY "policy_church_schedules_tenant_isolation" ON "church_schedules"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 13. church_events
ALTER TABLE "church_events" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_church_events_tenant_isolation" ON "church_events";
CREATE POLICY "policy_church_events_tenant_isolation" ON "church_events"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 14. church_news
ALTER TABLE "church_news" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_church_news_tenant_isolation" ON "church_news";
CREATE POLICY "policy_church_news_tenant_isolation" ON "church_news"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 15. church_sermons
ALTER TABLE "church_sermons" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_church_sermons_tenant_isolation" ON "church_sermons";
CREATE POLICY "policy_church_sermons_tenant_isolation" ON "church_sermons"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 16. church_ministries
ALTER TABLE "church_ministries" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_church_ministries_tenant_isolation" ON "church_ministries";
CREATE POLICY "policy_church_ministries_tenant_isolation" ON "church_ministries"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 17. church_leaders
ALTER TABLE "church_leaders" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_church_leaders_tenant_isolation" ON "church_leaders";
CREATE POLICY "policy_church_leaders_tenant_isolation" ON "church_leaders"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 18. church_gallery_albums
ALTER TABLE "church_gallery_albums" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_church_gallery_albums_tenant_isolation" ON "church_gallery_albums";
CREATE POLICY "policy_church_gallery_albums_tenant_isolation" ON "church_gallery_albums"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 19. church_prayer_requests
ALTER TABLE "church_prayer_requests" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_church_prayer_requests_tenant_isolation" ON "church_prayer_requests";
CREATE POLICY "policy_church_prayer_requests_tenant_isolation" ON "church_prayer_requests"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 20. church_donations
ALTER TABLE "church_donations" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_church_donations_tenant_isolation" ON "church_donations";
CREATE POLICY "policy_church_donations_tenant_isolation" ON "church_donations"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 21. church_live_streams
ALTER TABLE "church_live_streams" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_church_live_streams_tenant_isolation" ON "church_live_streams";
CREATE POLICY "policy_church_live_streams_tenant_isolation" ON "church_live_streams"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 22. church_banners
ALTER TABLE "church_banners" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_church_banners_tenant_isolation" ON "church_banners";
CREATE POLICY "policy_church_banners_tenant_isolation" ON "church_banners"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 23. site_domains
ALTER TABLE "site_domains" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_site_domains_tenant_isolation" ON "site_domains";
CREATE POLICY "policy_site_domains_tenant_isolation" ON "site_domains"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 24. site_redirects
ALTER TABLE "site_redirects" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_site_redirects_tenant_isolation" ON "site_redirects";
CREATE POLICY "policy_site_redirects_tenant_isolation" ON "site_redirects"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 25. form_definitions
ALTER TABLE "form_definitions" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_form_definitions_tenant_isolation" ON "form_definitions";
CREATE POLICY "policy_form_definitions_tenant_isolation" ON "form_definitions"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

-- 26. form_submissions
ALTER TABLE "form_submissions" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "policy_form_submissions_tenant_isolation" ON "form_submissions";
CREATE POLICY "policy_form_submissions_tenant_isolation" ON "form_submissions"
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

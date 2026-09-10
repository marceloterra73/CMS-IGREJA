CREATE TABLE "tenants" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"custom_domain" varchar(255),
	"logo_url" text,
	"contact_email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"active_modules" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "tenants_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'editor' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"custom_permissions" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "institutional_contents" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"profile" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"address" jsonb,
	"contact" jsonb,
	"social_links" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "institutional_contents_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "site_analytics" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"google_analytics_id" varchar(100),
	"google_tag_manager_id" varchar(100),
	"meta_pixel_id" varchar(100),
	"search_console_token" varchar(255),
	"anonymize_ip" boolean DEFAULT true,
	"consent_required" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_analytics_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "site_publication_settings" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"visibility" varchar(20) DEFAULT 'public' NOT NULL,
	"maintenance_mode" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_publication_settings_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"site_name" varchar(255),
	"language" varchar(20) DEFAULT 'pt-BR',
	"locale" varchar(20) DEFAULT 'pt-BR',
	"timezone" varchar(100) DEFAULT 'America/Sao_Paulo',
	"date_format" varchar(50) DEFAULT 'DD/MM/YYYY',
	"time_format" varchar(50) DEFAULT 'HH:mm',
	"favicon_media_id" varchar(64),
	"favicon_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "visual_themes" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"version" varchar(20) DEFAULT '1.0.0' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"tokens" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_blocks" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"section_id" varchar(64) NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"type" varchar(50) NOT NULL,
	"order_num" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_sections" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"page_id" varchar(64) NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255),
	"order_num" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"background_color" varchar(50),
	"config" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"order_num" integer DEFAULT 0 NOT NULL,
	"is_home" boolean DEFAULT false NOT NULL,
	"seo" jsonb DEFAULT '{"metaTitle":"","metaDescription":""}'::jsonb NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "navigation_menus" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_items" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255),
	"filename" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"type" varchar(20) NOT NULL,
	"size_bytes" bigint NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"dimensions" jsonb,
	"folder" varchar(100),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"uploaded_by" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "church_banners" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" text,
	"image_media_id" varchar(64),
	"primary_button_label" varchar(100),
	"primary_button_url" text,
	"secondary_button_label" varchar(100),
	"secondary_button_url" text,
	"order_num" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "church_donations" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"bank_account_info" text,
	"pix_key" varchar(255),
	"instructions" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "church_events" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"start_date" varchar(50) NOT NULL,
	"end_date" varchar(50),
	"time" varchar(50),
	"location" varchar(255),
	"image_media_id" varchar(64),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "church_gallery_albums" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255),
	"description" text,
	"cover_media_id" varchar(64),
	"media_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "church_leaders" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"description" text,
	"photo_media_id" varchar(64),
	"order_num" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "church_live_streams" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"stream_url" text,
	"status" varchar(20) DEFAULT 'offline' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "church_ministries" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"leader_name" varchar(255),
	"image_media_id" varchar(64),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "church_news" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"summary" text,
	"content" text NOT NULL,
	"image_media_id" varchar(64),
	"author" varchar(255),
	"published_at" timestamp with time zone,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "church_prayer_requests" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255),
	"requester_name" varchar(255),
	"request_text" text NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "church_schedules" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"day_of_week" varchar(50),
	"time" varchar(50) NOT NULL,
	"description" text,
	"location" varchar(255),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "church_sermons" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"preacher" varchar(255) NOT NULL,
	"date" varchar(50) NOT NULL,
	"scripture_reference" varchar(255),
	"video_url" text,
	"audio_media_id" varchar(64),
	"thumbnail_media_id" varchar(64),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_domains" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"hostname" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_domains_hostname_unique" UNIQUE("hostname")
);
--> statement-breakpoint
CREATE TABLE "site_redirects" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"source_path" varchar(500) NOT NULL,
	"target_type" varchar(20) NOT NULL,
	"target_page_id" varchar(64),
	"target_url" text,
	"type" varchar(20) DEFAULT 'permanent' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_definitions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64) NOT NULL,
	"form_id" varchar(64) NOT NULL,
	"status" varchar(20) DEFAULT 'received' NOT NULL,
	"values" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutional_contents" ADD CONSTRAINT "institutional_contents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_analytics" ADD CONSTRAINT "site_analytics_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_publication_settings" ADD CONSTRAINT "site_publication_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visual_themes" ADD CONSTRAINT "visual_themes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD CONSTRAINT "page_blocks_section_id_page_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."page_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_blocks" ADD CONSTRAINT "page_blocks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "navigation_menus" ADD CONSTRAINT "navigation_menus_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_banners" ADD CONSTRAINT "church_banners_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_donations" ADD CONSTRAINT "church_donations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_events" ADD CONSTRAINT "church_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_gallery_albums" ADD CONSTRAINT "church_gallery_albums_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_leaders" ADD CONSTRAINT "church_leaders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_live_streams" ADD CONSTRAINT "church_live_streams_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_ministries" ADD CONSTRAINT "church_ministries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_news" ADD CONSTRAINT "church_news_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_prayer_requests" ADD CONSTRAINT "church_prayer_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_schedules" ADD CONSTRAINT "church_schedules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "church_sermons" ADD CONSTRAINT "church_sermons_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_domains" ADD CONSTRAINT "site_domains_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_redirects" ADD CONSTRAINT "site_redirects_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_definitions" ADD CONSTRAINT "form_definitions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_form_definitions_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form_definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tenants_slug" ON "tenants" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_tenants_status" ON "tenants" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_users_tenant" ON "users" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "idx_institutional_tenant" ON "institutional_contents" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_site_analytics_tenant" ON "site_analytics" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_site_publication_tenant" ON "site_publication_settings" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_site_settings_tenant" ON "site_settings" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_visual_themes_tenant" ON "visual_themes" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_visual_themes_status" ON "visual_themes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_page_blocks_section" ON "page_blocks" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "idx_page_blocks_tenant" ON "page_blocks" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_page_blocks_order" ON "page_blocks" USING btree ("order_num");--> statement-breakpoint
CREATE INDEX "idx_page_blocks_type" ON "page_blocks" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_page_sections_page" ON "page_sections" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX "idx_page_sections_tenant" ON "page_sections" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_page_sections_order" ON "page_sections" USING btree ("order_num");--> statement-breakpoint
CREATE INDEX "idx_pages_tenant" ON "pages" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_pages_slug" ON "pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_pages_status" ON "pages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_pages_order" ON "pages" USING btree ("order_num");--> statement-breakpoint
CREATE INDEX "idx_navigation_menus_tenant" ON "navigation_menus" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_navigation_menus_location" ON "navigation_menus" USING btree ("location");--> statement-breakpoint
CREATE INDEX "idx_media_items_tenant" ON "media_items" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_media_items_type" ON "media_items" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_media_items_status" ON "media_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_church_banners_tenant" ON "church_banners" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_church_banners_order" ON "church_banners" USING btree ("order_num");--> statement-breakpoint
CREATE INDEX "idx_church_banners_status" ON "church_banners" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_church_donations_tenant" ON "church_donations" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_church_donations_status" ON "church_donations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_church_events_tenant" ON "church_events" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_church_events_slug" ON "church_events" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_church_events_status" ON "church_events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_church_gallery_tenant" ON "church_gallery_albums" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_church_gallery_status" ON "church_gallery_albums" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_church_leaders_tenant" ON "church_leaders" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_church_leaders_order" ON "church_leaders" USING btree ("order_num");--> statement-breakpoint
CREATE INDEX "idx_church_leaders_status" ON "church_leaders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_church_livestreams_tenant" ON "church_live_streams" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_church_livestreams_status" ON "church_live_streams" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_church_ministries_tenant" ON "church_ministries" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_church_ministries_slug" ON "church_ministries" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_church_ministries_status" ON "church_ministries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_church_news_tenant" ON "church_news" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_church_news_slug" ON "church_news" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_church_news_status" ON "church_news" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_church_prayer_tenant" ON "church_prayer_requests" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_church_prayer_status" ON "church_prayer_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_church_schedules_tenant" ON "church_schedules" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_church_schedules_status" ON "church_schedules" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_church_sermons_tenant" ON "church_sermons" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_church_sermons_slug" ON "church_sermons" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_church_sermons_status" ON "church_sermons" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_site_domains_tenant" ON "site_domains" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_site_domains_hostname" ON "site_domains" USING btree ("hostname");--> statement-breakpoint
CREATE INDEX "idx_site_domains_status" ON "site_domains" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_site_redirects_tenant" ON "site_redirects" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_site_redirects_source" ON "site_redirects" USING btree ("source_path");--> statement-breakpoint
CREATE INDEX "idx_form_definitions_tenant" ON "form_definitions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_form_definitions_slug" ON "form_definitions" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_form_definitions_status" ON "form_definitions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_form_submissions_tenant" ON "form_submissions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_form_submissions_form" ON "form_submissions" USING btree ("form_id");--> statement-breakpoint
CREATE INDEX "idx_form_submissions_status" ON "form_submissions" USING btree ("status");
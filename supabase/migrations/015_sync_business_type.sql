-- Sync businessType for existing kuliner_rumahan businesses
UPDATE "Business" SET "businessType" = 'kuliner_rumahan' WHERE category = 'kuliner_rumahan' AND ("businessType" IS NULL OR "businessType" = 'directory');

-- Migration 019: Add business visibility toggle
-- This adds the isPublic column to the Business table to allow users to hide their stores.

ALTER TABLE "Business" 
ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT true;

-- Update existing records to be public by default
UPDATE "Business" SET "isPublic" = true WHERE "isPublic" IS NULL;

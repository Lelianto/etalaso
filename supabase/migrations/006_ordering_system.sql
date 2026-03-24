-- 006_ordering_system.sql
-- Add payment configuration columns to Business table for pre-order flow

ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "bankName" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "bankAccountNumber" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "bankAccountName" TEXT;
ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "qrisImageUrl" TEXT;

-- Create storage bucket for payment proof uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload payment proofs
CREATE POLICY "Authenticated users can upload payment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');

-- Allow public read access to payment proofs
CREATE POLICY "Public read access to payment proofs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

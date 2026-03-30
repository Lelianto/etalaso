-- Create storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload product images
CREATE POLICY "Auth users upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow public read access to product images
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow authenticated users to delete their own product images
CREATE POLICY "Auth users delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

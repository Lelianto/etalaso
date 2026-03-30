-- 012_free_tier_products.sql
-- Update product limits: free=3, umkm=20, business=50

UPDATE "Plan" SET
  max_products = 3,
  features = '["Halaman bisnis otomatis","Template dasar","Tombol WhatsApp","3 produk/layanan"]'
WHERE id = 'free';

UPDATE "Plan" SET
  max_products = 20,
  features = '["Edit teks profil","Upload foto produk","6 pilihan template","Tombol WhatsApp","20 produk/layanan"]'
WHERE id = 'umkm';

UPDATE "Plan" SET
  max_products = 50,
  features = '["Semua 150+ template","Banner custom","50 produk/layanan","Subdomain .etalaso.id","Statistik pengunjung"]'
WHERE id = 'business';

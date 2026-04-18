# Rencana Pengembangan Bisnis & Keamanan Web — Etalaso

> Dokumen ini berisi analisis kompetitor, strategi pengembangan bisnis, dan rencana peningkatan keamanan web untuk platform **Etalaso** — direktori bisnis lokal berbasis WhatsApp untuk UMKM di wilayah Tangerang.
>
> Tanggal: 1 April 2026

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Analisis Kompetitor](#2-analisis-kompetitor)
3. [Keunggulan Kompetitif Etalaso](#3-keunggulan-kompetitif-etalaso)
4. [Gap Analysis & Peluang](#4-gap-analysis--peluang)
5. [Rencana Pengembangan Bisnis](#5-rencana-pengembangan-bisnis)
6. [Rencana Keamanan Web](#6-rencana-keamanan-web)
7. [Kepatuhan Regulasi (UU PDP)](#7-kepatuhan-regulasi-uu-pdp)
8. [Roadmap Implementasi](#8-roadmap-implementasi)

---

## 1. Ringkasan Eksekutif

Etalaso adalah platform direktori bisnis lokal yang melayani UMKM di wilayah Tangerang (Kabupaten Tangerang, Kota Tangerang, Tangerang Selatan — 49 kecamatan). Platform ini menawarkan profil bisnis gratis, sistem pemesanan via WhatsApp untuk kategori kuliner, dan model langganan berjenjang (Gratis / UMKM Rp 15.000/bulan / Business Rp 59.000/bulan).

Dokumen ini menganalisis **10+ kompetitor** sejenis, mengidentifikasi peluang pertumbuhan, dan menyusun rencana keamanan komprehensif berdasarkan standar OWASP 2025 dan UU PDP Indonesia.

---

## 2. Analisis Kompetitor

### 2.1 Platform Pesan-Antar Makanan

| Platform | Komisi | Fitur Utama | Kelebihan vs Etalaso | Kekurangan vs Etalaso |
|----------|--------|-------------|----------------------|----------------------|
| **GoFood / GoBiz** | 20% + Rp 1.000/trx | Pemesanan + delivery, GoPay, analytics, promosi | User base masif, logistik delivery built-in, brand recognition | Komisi tinggi, tidak support kuliner rumahan tanpa alamat formal, tidak ada WhatsApp ordering |
| **GrabFood** | 20-30% (+ PPN) | Self-serve registration, OVO payment, advertising | User base besar, marketing tools | Komisi tertinggi (hingga 30%), tidak cocok untuk kuliner rumahan |
| **ShopeeFood** | 15-20% + 3-5% service fee | Integrasi Shopee, ShopeePay, training | Leverage user base Shopee, komisi lebih rendah | Masih commission-based, terbatas pada app Shopee |

**Insight**: Semua platform pesan-antar menggunakan model komisi (15-30% per transaksi), yang membebani UMKM kecil. Etalaso dengan model langganan flat (Rp 15.000-59.000/bulan) memiliki value proposition yang jelas untuk UMKM dengan margin kecil.

### 2.2 Platform Direktori Bisnis

| Platform | Harga | Fitur Utama | Kelebihan vs Etalaso | Kekurangan vs Etalaso |
|----------|-------|-------------|----------------------|----------------------|
| **Google Business Profile** | Gratis | Listing di Google Search & Maps, review, foto, insights | Jangkauan masif, integrasi Search/Maps, gratis penuh | Tidak ada ordering, tidak ada WhatsApp integration, tidak ada fitur khusus kuliner |
| **IndonesiaYP (Yellow Pages)** | Gratis (basic) | Direktori 929 kategori, info kontak | Brand established, kategori lengkap | UX ketinggalan zaman, tidak mobile-first, tidak ada ordering/WhatsApp |

### 2.3 Platform Pemberdayaan UMKM

| Platform | Harga | Fitur Utama | Kelebihan vs Etalaso | Kekurangan vs Etalaso |
|----------|-------|-------------|----------------------|----------------------|
| **LinkUMKM (BRI)** | Gratis | Self-assessment, Etalase Digital, NIB, komunitas, media | 14,98 juta pengguna, backing pemerintah & BRI | Tidak ada ordering, tidak hyper-local, bukan platform discovery konsumen |
| **E-Katalog Tangerang** | Gratis | Katalog digital UMKM untuk pengadaan pemerintah | Akses pengadaan pemerintah | Fokus procurement bukan konsumen, fitur sangat terbatas |
| **Wahyoo** | - | Supply chain, micro-financing, kitchen partnerships, training | Deep operational support untuk warung | B2B focused, bukan consumer-facing directory |
| **Majoo** | Langganan SaaS | POS, inventory, CRM, analytics, multi-outlet | Tools manajemen komprehensif, 35.000+ merchant | Bukan platform discovery, tidak ada WhatsApp ordering |

### 2.4 Platform WhatsApp Commerce

| Platform | Harga | Fitur Utama | Kelebihan vs Etalaso | Kekurangan vs Etalaso |
|----------|-------|-------------|----------------------|----------------------|
| **WhatsApp Business App** | Gratis | Katalog produk, cart, auto-reply, business profile | Ubikuitas (90%+ pengguna Indonesia), gratis | Tidak ada discovery/directory, tidak ada analytics, merchant handle semua manual |
| **WhatsApp Business API** | Per-conversation | Chatbot, CRM integration, broadcast | Automasi kuat, scalable | Kompleks, mahal untuk UMKM kecil |
| **Dazo.id** | Langganan | Toko online + WhatsApp chatbot integration | Deep WhatsApp chatbot, automated ordering | Tidak ada local directory, tidak Tangerang-focused |

### 2.5 Kompetitor Internasional

| Platform | Model | Relevansi |
|----------|-------|-----------|
| **Yelp** | Listing gratis + iklan CPC | Benchmark untuk review system & trust/safety (memfilter 500K+ review AI-generated di 2025) |
| **TripAdvisor** | Listing gratis + iklan | Benchmark untuk business verification & review moderation |

---

## 3. Keunggulan Kompetitif Etalaso

### 3.1 Diferensiasi Utama

| Aspek | Etalaso | GoFood/GrabFood | Google Business | LinkUMKM |
|-------|---------|-----------------|-----------------|----------|
| Model biaya | Flat subscription | 15-30% komisi | Gratis | Gratis |
| WhatsApp ordering | Ya | Tidak | Tidak | Tidak |
| Multi-kategori bisnis | Ya (12+ kategori) | Hanya makanan | Ya | Ya |
| Kuliner rumahan | Fitur khusus | Sulit daftar | Tidak ada fitur khusus | Tidak ada |
| Fokus lokal (kecamatan) | 49 kecamatan detail | Nasional | Global | Nasional |
| Template bisnis | 6+ template | Tidak ada | Tidak ada | Tidak ada |
| Onboarding non-teknis | Ya, sangat sederhana | Moderat | Moderat | Moderat |

### 3.2 Unique Selling Points

1. **Zero Commission** — Langganan flat vs 15-30% per transaksi
2. **WhatsApp-Native** — Ordering langsung ke WhatsApp pemilik bisnis, sesuai kebiasaan konsumen Indonesia
3. **Hyper-Local** — Kategorisasi level kecamatan yang platform nasional tidak bisa tandingi
4. **Inklusif untuk Kuliner Rumahan** — Tidak membutuhkan alamat formal/izin usaha seperti GoFood/GrabFood
5. **Multi-Kategori** — Satu-satunya platform yang menggabungkan directory + ordering untuk berbagai jenis UMKM

---

## 4. Gap Analysis & Peluang

### 4.1 Gap yang Perlu Ditutup

| Area | Status Etalaso Saat Ini | Standar Kompetitor | Prioritas |
|------|------------------------|-------------------|-----------|
| **Review System** | Ada (basic) | Yelp: AI moderation, trust score | Tinggi |
| **Delivery Logistics** | Hanya arahkan ke Gojek/Grab | GoFood: built-in delivery | Rendah (bukan core) |
| **Payment Gateway** | Manual QRIS upload | GrabFood: auto-payment | Sedang |
| **Analytics** | Basic (views + WA clicks) | Google: comprehensive insights | Sedang |
| **SEO Bisnis** | Ada (structured data) | Google: dominant search presence | Tinggi |
| **Notifikasi** | Tidak ada | GoFood: push notifications | Sedang |
| **Rating & Trust** | Basic reviews | Yelp: verified reviews, fraud detection | Tinggi |
| **Automasi Chat** | Tidak ada | Dazo: WhatsApp chatbot | Rendah |
| **Multi-Platform** | Web only | GoFood: mobile app | Sedang |

### 4.2 Peluang Pertumbuhan

1. **Ekspansi Wilayah** — Bogor, Depok, Bekasi (Jabodetabek) setelah Tangerang solid
2. **Kemitraan dengan Pemerintah Daerah** — Program digitalisasi UMKM pemerintah kota/kabupaten
3. **Integrasi Payment Gateway** — Midtrans/Xendit untuk automasi pembayaran
4. **Program Referral** — UMKM mengajak UMKM lain, insentif bulan gratis
5. **Fitur Promosi** — Iklan berbayar di halaman kategori (revenue stream baru)
6. **API untuk Partner** — Integrasi dengan POS systems seperti Majoo
7. **WhatsApp Bot** — Automasi order confirmation dan tracking

---

## 5. Rencana Pengembangan Bisnis

### 5.1 Strategi Jangka Pendek (Q2–Q3 2026)

#### A. Akuisisi Pengguna
- **Target**: 5.000 bisnis terdaftar di Tangerang
- **Strategi**:
  - Door-to-door onboarding di pasar dan area UMKM
  - Kemitraan dengan komunitas UMKM lokal (Kamar Dagang, koperasi)
  - Program "Gratis Selamanya" untuk 1.000 UMKM pertama per kecamatan
  - Social media campaign dengan testimoni pemilik UMKM

#### B. Peningkatan Produk
- **Review System Enhancement**: Verifikasi review, filter spam/AI-generated
- **Push Notifications**: WhatsApp broadcast untuk promo bisnis
- **Template Baru**: Tambah 4+ template untuk kategori non-kuliner
- **Analytics V2**: Tambah demographic insights, conversion tracking

#### C. Revenue Optimization
- **Trial Period**: 14 hari gratis untuk tier UMKM pada klaim bisnis
- **Annual Plan Discount**: Diskon 20% untuk langganan tahunan
- **Featured Listing**: Bisnis bisa bayar untuk tampil di posisi atas pencarian

### 5.2 Strategi Jangka Menengah (Q4 2026 – Q2 2027)

#### A. Ekspansi Produk
- **Progressive Web App (PWA)**: Pengalaman mobile tanpa perlu app store
- **Integrasi Payment Gateway**: Midtrans/Xendit untuk pembayaran otomatis
- **WhatsApp Bot**: Auto-reply untuk konfirmasi pesanan
- **Menu Digital QR**: QR code untuk dine-in ordering di tempat

#### B. Ekspansi Wilayah
- **Fase 1**: Jakarta Barat & Selatan (kedekatan geografis)
- **Fase 2**: Bogor, Depok, Bekasi
- **Strategi**: Scraping Google Maps + outreach ke UMKM per kecamatan

#### C. Kemitraan Strategis
- **Bank/Fintech**: BRI, BCA, Dana untuk program UMKM digital
- **Pemerintah Daerah**: MoU digitalisasi UMKM dengan Pemkot/Pemkab
- **Logistik**: Kemitraan dengan kurir lokal untuk delivery terintegrasi

### 5.3 Strategi Jangka Panjang (2027+)

- **Marketplace B2B**: UMKM bisa saling order supply (referensi Wahyoo)
- **AI-Powered Insights**: Rekomendasi produk, analisis tren, prediksi penjualan
- **Franchise Model**: Lisensi platform ke kota lain dengan tim lokal
- **UMKM Financing**: Kemitraan dengan fintech untuk micro-lending berdasarkan data transaksi

---

## 6. Rencana Keamanan Web

### 6.1 Analisis OWASP Top 10:2025

| # | Kategori | Risiko untuk Etalaso | Status Saat Ini | Rekomendasi |
|---|----------|---------------------|----------------|-------------|
| A01 | **Broken Access Control** | TINGGI — Multi-role (admin, owner, public) | RLS Supabase aktif | Audit semua RLS policy, tambah integration test |
| A02 | **Security Misconfiguration** | TINGGI — Supabase config, CORS, headers | Partial | Tambah CSP headers, audit environment variables |
| A03 | **Software Supply Chain** | SEDANG — npm dependencies | Tidak ada audit | Tambah `npm audit` di CI/CD, Dependabot/Renovate |
| A04 | **Cryptographic Failures** | SEDANG — Payment proofs, credentials | Supabase handles auth crypto | Validasi signed URLs, enforce HTTPS everywhere |
| A05 | **Injection** | SEDANG — API routes, form inputs | Supabase parameterized queries | Tambah input validation library (zod) di semua API routes |
| A06 | **Insecure Design** | SEDANG — Manual QRIS verification | By design | Dokumentasikan trust assumptions, add fraud detection |
| A07 | **Authentication Failures** | TINGGI — Session management | Supabase Auth | Tambah 2FA untuk admin, session timeout, token rotation |
| A08 | **Data Integrity Failures** | SEDANG — Payment proof tampering | Tidak ada verifikasi integrity | Hash file upload, metadata validation |
| A09 | **Logging & Alerting** | TINGGI — Tidak ada structured logging | Minimal (scraper.log) | Implementasi centralized logging (Sentry/LogTail) |
| A10 | **Error Handling** | SEDANG — Error leaks internal details | Partial | Standardisasi error responses, hide stack traces |

### 6.2 Rencana Implementasi Keamanan

#### Fase 1: Prioritas Kritis (Segera)

**1. Audit & Perkuat Access Control (OWASP A01)**
- Audit semua RLS policy di Supabase — pastikan setiap tabel memiliki policy yang tepat
- Verifikasi `requireAuth()` dan `requireAdmin()` dipanggil di semua protected routes
- Tambah integration test untuk RLS policies
- Pastikan `service_role` key hanya digunakan di server-side

**2. Rate Limiting (DDoS & Brute Force Prevention)**
- Implementasi rate limiting di API routes kritis:
  - `/api/auth/*` — max 5 request/menit
  - `/api/claim` — max 3 request/jam
  - `/api/business/register` — max 5 request/jam
  - `/api/kuliner/register` — max 5 request/jam
  - `/api/report` — max 10 request/jam
- Gunakan library seperti `@upstash/ratelimit` dengan Redis

**3. Input Validation & Sanitization (OWASP A05)**
- Implementasi Zod schema validation di semua API routes
- Sanitasi HTML/script injection di input user (nama bisnis, deskripsi, review)
- Perkuat profanity filter yang sudah ada di `/src/lib/moderation.ts`

**4. Security Headers (OWASP A02)**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.supabase.co;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

#### Fase 2: Penting (1-2 Bulan)

**5. Monitoring & Logging (OWASP A09)**
- Integrasikan Sentry untuk error tracking
- Implementasi structured logging dengan format JSON
- Setup alerting untuk:
  - Failed authentication attempts (>5 per IP)
  - Unusual admin actions
  - Payment anomalies
  - API error rate spikes

**6. Authentication Enhancement (OWASP A07)**
- Tambah Two-Factor Authentication (2FA) untuk akun admin
- Implementasi session timeout (idle 30 menit, absolute 24 jam)
- Token rotation pada setiap request
- Deteksi login dari device/lokasi baru

**7. Supply Chain Security (OWASP A03)**
- Tambah `npm audit` di CI/CD pipeline
- Setup Dependabot atau Renovate untuk auto-update dependencies
- Pin dependency versions di `package-lock.json`
- Review dan minimalisasi dependencies yang tidak diperlukan

**8. File Upload Security**
- Validasi tipe file (hanya image: JPEG, PNG, WebP)
- Limit ukuran file (max 5MB untuk payment proof, 2MB untuk produk)
- Scan malware pada upload (ClamAV atau cloud scanning)
- Generate hash SHA-256 untuk integrity verification
- Simpan file dengan nama random (hindari path traversal)

#### Fase 3: Peningkatan (3-6 Bulan)

**9. Automated Security Testing**
- SAST (Static Application Security Testing) di CI/CD — gunakan `semgrep` atau `eslint-plugin-security`
- DAST (Dynamic Application Security Testing) — schedule scan berkala dengan OWASP ZAP
- Dependency vulnerability scanning otomatis

**10. Payment Security Enhancement**
- Implementasi fraud detection untuk upload payment proof:
  - Image metadata analysis (detect reused screenshots)
  - Duplicate payment detection
  - Timestamp validation
- Pertimbangkan integrasi Midtrans/Xendit untuk mengurangi risiko manual verification

**11. Data Encryption**
- Encrypt sensitive data at rest (nomor WhatsApp, alamat) menggunakan Supabase Vault
- Implement field-level encryption untuk PII (Personally Identifiable Information)
- Audit data retention policy — hapus data yang tidak diperlukan

**12. Penetration Testing**
- Lakukan penetration test oleh pihak ketiga sebelum scaling
- Focus area: authentication bypass, privilege escalation, injection, business logic flaws
- Remediasi semua temuan critical dan high sebelum ekspansi wilayah

### 6.3 Security Checklist per Release

```
[ ] Semua API routes memiliki input validation (Zod)
[ ] RLS policies tested untuk setiap tabel yang dimodifikasi
[ ] Tidak ada secret/credential yang di-commit
[ ] npm audit menunjukkan 0 critical/high vulnerability
[ ] Security headers aktif di semua routes
[ ] Error responses tidak mengekspos internal details
[ ] File uploads divalidasi (tipe, ukuran, content)
[ ] Rate limiting aktif di endpoint publik
[ ] Logging mencatat security-relevant events
```

---

## 7. Kepatuhan Regulasi (UU PDP)

### 7.1 Status UU PDP Indonesia

- **UU No. 27 Tahun 2022** tentang Perlindungan Data Pribadi
- **Masa transisi berakhir**: 17 Oktober 2024 — **kepatuhan penuh wajib**
- **Lembaga PDP**: Diperkirakan operasional penuh di 2026 dengan wewenang penegakan
- **Sanksi**: Hingga 2% pendapatan tahunan untuk denda administratif; sanksi pidana untuk pelanggaran serius

### 7.2 Data yang Dikumpulkan Etalaso

| Jenis Data | Contoh | Klasifikasi UU PDP |
|-----------|--------|-------------------|
| Identitas pemilik bisnis | Nama, email, nomor WhatsApp | Data Pribadi Umum |
| Lokasi bisnis | Alamat, kecamatan, koordinat | Data Pribadi Umum |
| Data pembayaran | Bukti transfer QRIS, riwayat langganan | Data Pribadi Umum |
| Data review | Nama reviewer, komentar | Data Pribadi Umum |
| Analytics | IP address, page views, device info | Data Pribadi Umum |

### 7.3 Checklist Kepatuhan UU PDP

#### Sudah Terpenuhi
- [x] Kebijakan privasi tersedia (`/kebijakan-privasi`)
- [x] Syarat & ketentuan tersedia (`/syarat-ketentuan`)
- [x] Disclaimer tersedia (`/disclaimer`)
- [x] Data dienkripsi in transit (HTTPS via Vercel)
- [x] Access control berbasis role (RLS Supabase)

#### Perlu Diimplementasi
- [ ] **Consent Management** — Banner/popup persetujuan pengumpulan data pada registrasi
- [ ] **Data Subject Rights Portal** — Fitur bagi pengguna untuk:
  - Melihat data yang dikumpulkan tentang mereka
  - Meminta koreksi data yang salah
  - Meminta penghapusan data (right to be forgotten)
  - Mengunduh data mereka (data portability)
- [ ] **Breach Notification Procedure** — SOP notifikasi dalam 72 jam jika terjadi kebocoran data
- [ ] **Data Processing Agreement** — Perjanjian dengan Supabase & Vercel sebagai data processor
- [ ] **Data Retention Policy** — Tentukan berapa lama setiap jenis data disimpan dan kapan dihapus
- [ ] **Privacy Impact Assessment** — Dokumen analisis dampak privasi untuk fitur baru
- [ ] **DPO (Data Protection Officer)** — Tunjuk PIC perlindungan data (minimal 1 orang)
- [ ] **Incident Response Plan** — SOP penanganan insiden keamanan data

### 7.4 Rekomendasi Implementasi UU PDP

**Prioritas 1 (Segera)**:
1. Update halaman kebijakan privasi dengan detail spesifik UU PDP
2. Tambah consent checkbox pada form registrasi bisnis dan akun
3. Buat SOP breach notification (template dokumen + alur eskalasi)

**Prioritas 2 (1-2 Bulan)**:
4. Bangun halaman "Data Saya" di dashboard pengguna (view, export, delete)
5. Implementasi data retention policy (auto-delete inactive data setelah 2 tahun)
6. Tunjuk DPO internal

**Prioritas 3 (3-6 Bulan)**:
7. Review dan tandatangani DPA dengan semua data processor (Supabase, Vercel)
8. Lakukan Privacy Impact Assessment untuk setiap fitur utama
9. Siapkan dokumentasi untuk audit Lembaga PDP

---

## 8. Roadmap Implementasi

### Q2 2026 (April – Juni)

| Minggu | Bisnis | Keamanan |
|--------|--------|----------|
| 1-2 | Audit kompetitor selesai, finalisasi pricing strategy | Audit RLS policies, implementasi rate limiting |
| 3-4 | Launch program referral UMKM | Tambah CSP headers, input validation (Zod) |
| 5-6 | Featured listing feature (revenue baru) | Setup Sentry monitoring, structured logging |
| 7-8 | Kemitraan komunitas UMKM Tangerang | 2FA admin, session management enhancement |
| 9-10 | Target 3.000 bisnis terdaftar | npm audit di CI/CD, file upload security |
| 11-12 | Annual plan launch dengan diskon | UU PDP: update privacy policy, consent management |

### Q3 2026 (Juli – September)

| Minggu | Bisnis | Keamanan |
|--------|--------|----------|
| 1-4 | PWA development, template baru | SAST/DAST di CI/CD, penetration test |
| 5-8 | Analytics V2, push notifications | Data encryption at rest, DPO appointment |
| 9-12 | Persiapan ekspansi Jakarta Barat | Data Subject Rights portal, breach SOP |

### Q4 2026 (Oktober – Desember)

| Minggu | Bisnis | Keamanan |
|--------|--------|----------|
| 1-4 | Launch Jakarta Barat | Payment gateway integration (Midtrans) |
| 5-8 | WhatsApp Bot MVP | Fraud detection system |
| 9-12 | Target 10.000 bisnis, review tahunan | Security audit tahunan, persiapan audit Lembaga PDP |

### 2027

| Quarter | Bisnis | Keamanan |
|---------|--------|----------|
| Q1 | Ekspansi Bogor, Depok | SOC 2 preparation |
| Q2 | B2B marketplace MVP | Automated threat detection |
| Q3 | Ekspansi Bekasi | Annual penetration test |
| Q4 | AI insights, franchise model exploration | Compliance review & certification |

---

## Lampiran

### A. Perbandingan Biaya untuk UMKM

Simulasi biaya bulanan untuk warung makan dengan 50 pesanan/hari, rata-rata Rp 25.000/pesanan:

| Platform | Model | Biaya/Bulan | % dari Omzet |
|----------|-------|-------------|-------------|
| GoFood | 20% komisi + Rp 1.000/trx | Rp 7.550.000 | 20,1% |
| GrabFood | 25% komisi (rata-rata) | Rp 9.375.000 | 25,0% |
| ShopeeFood | 17% komisi + 4% service | Rp 7.875.000 | 21,0% |
| **Etalaso UMKM** | **Flat subscription** | **Rp 15.000** | **0,04%** |
| **Etalaso Business** | **Flat subscription** | **Rp 59.000** | **0,16%** |

> Omzet bulanan estimasi: 50 pesanan x Rp 25.000 x 30 hari = Rp 37.500.000

### B. Sumber Referensi

- [OWASP Top 10:2025](https://owasp.org/Top10/2025/)
- [UU PDP No. 27/2022](https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [GoFood Merchant](https://gofoodmerchant.co.id/)
- [GrabMerchant](https://www.grab.com/id/en/merchant/)
- [ShopeeFood Merchants](https://www.shopeefood.co.id/merchants/about-merchants)
- [LinkUMKM BRI](https://linkumkm.id/) — 14,98 juta pengguna (2025)
- [Yelp Trust & Safety Report 2025](https://blog.yelp.com/news/2025-trust-and-safety-report/)
- [Indonesia Data Protection - Chambers 2026](https://practiceguides.chambers.com/practice-guides/data-protection-privacy-2026/indonesia/)

---

*Dokumen ini dibuat pada 1 April 2026 dan perlu di-review secara berkala sesuai perkembangan pasar dan regulasi.*

export const CATEGORIES = [
  { value: 'kuliner', label: 'Kuliner' },
  { value: 'kuliner_rumahan', label: 'Kuliner Rumahan' },
  { value: 'otomotif', label: 'Bengkel & Otomotif' },
  { value: 'kecantikan', label: 'Salon & Kecantikan' },
  { value: 'jasa', label: 'Jasa' },
  { value: 'retail', label: 'Toko & Retail' },
  { value: 'kesehatan', label: 'Apotek & Kesehatan' },
  { value: 'mall', label: 'Mall & Pusat Belanja' },
  { value: 'rumah_sakit', label: 'Rumah Sakit' },
  { value: 'klinik', label: 'Klinik' },
  { value: 'taman', label: 'Taman & Rekreasi' },
  { value: 'tempat_ibadah', label: 'Tempat Ibadah' },
  { value: 'lainnya', label: 'Lainnya' },
] as const

export type CategoryValue = (typeof CATEGORIES)[number]['value']

export const VALID_CATEGORIES = new Set<string>(CATEGORIES.map(c => c.value))

export const REGION_LABELS: Record<string, string> = {
  kab_tangerang: 'Kabupaten Tangerang',
  kota_tangerang: 'Kota Tangerang',
  tangsel: 'Kota Tangerang Selatan',
}

export const KECAMATAN_LIST = [
  // Kabupaten Tangerang (29)
  { name: 'Balaraja', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Cikupa', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Cisauk', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Cisoka', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Curug', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Gunung Kaler', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Jambe', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Jayanti', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Kelapa Dua', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Kemiri', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Kosambi', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Kresek', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Kronjo', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Legok', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Mauk', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Mekar Baru', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Pagedangan', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Pakuhaji', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Panongan', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Pasar Kemis', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Rajeg', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Sepatan', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Sepatan Timur', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Sindang Jaya', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Solear', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Sukadiri', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Sukamulya', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Teluknaga', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },
  { name: 'Tigaraksa', region: 'kab_tangerang', regionLabel: 'Kabupaten Tangerang' },

  // Kota Tangerang (13)
  { name: 'Batuceper', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Benda', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Cibodas', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Ciledug', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Cipondoh', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Jatiuwung', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Karang Tengah', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Karawaci', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Larangan', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Neglasari', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Periuk', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Pinang', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },
  { name: 'Tangerang', region: 'kota_tangerang', regionLabel: 'Kota Tangerang' },

  // Kota Tangerang Selatan (7)
  { name: 'Ciputat', region: 'tangsel', regionLabel: 'Kota Tangerang Selatan' },
  { name: 'Ciputat Timur', region: 'tangsel', regionLabel: 'Kota Tangerang Selatan' },
  { name: 'Pamulang', region: 'tangsel', regionLabel: 'Kota Tangerang Selatan' },
  { name: 'Pondok Aren', region: 'tangsel', regionLabel: 'Kota Tangerang Selatan' },
  { name: 'Serpong', region: 'tangsel', regionLabel: 'Kota Tangerang Selatan' },
  { name: 'Serpong Utara', region: 'tangsel', regionLabel: 'Kota Tangerang Selatan' },
  { name: 'Setu', region: 'tangsel', regionLabel: 'Kota Tangerang Selatan' },
] as const

export const VALID_KECAMATAN = new Set<string>(KECAMATAN_LIST.map(k => k.name))

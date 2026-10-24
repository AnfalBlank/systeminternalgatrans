# Gatrans Management Operations System (MOS)

Sistem Manajemen Keamanan Kargo & Disposisi Bandara (Aviation Cargo Security Screening, Line 1 Dispatch & Delivery Order System) berbasis standar regulasi ICAO Annex 17 & PM 53/2017.

## Fitur Utama

- **Role-Based Access Control (RBAC):** Superadmin, Managerial / Owner, Admin CSD, Checker, Operator X-Ray, AVSEC Officer, Handler, Driver Lini 1, dan Finance Admin.
- **Executive & Managerial Dashboard:** Visualisasi metrik finansial, throughput kargo harian, kepatuhan SLA turnaround time, dan analisis aging piutang (AR).
- **Inspeksi Keamanan & X-Ray Screening:** Penilaian Z-effective, deteksi anomali bahan organik/anorganik, dan integrasi simulator pemindai barcode kargo.
- **Pemeriksaan Lanjutan EVD & Checklist Kelaikan Terbang:** Pengujian jejak partikel terlarang dan pengesahan kelaikan terbang oleh Senior AVSEC.
- **Penerbitan Dokumen Resmi & Ekspor PDF:** Cetak lembar Delivery Order (DO), CSD (Cargo Security Declaration), STK (Surat Tugas Kargo), Bukti Timbang, dan Berita Acara Rekonsiliasi.
- **Pusat Pesan & Chat Operasional:** Komunikasi antar-divisi dengan filter tagging AWB, prioritas darurat, respons preset cepat, dan dukungan multi-channel.
- **Audit Log Terenkripsi & Idempotent Scanning:** Rekam jejak kronologis setiap pemindaian koli dan aksi user tanpa risiko duplikasi transaksi ganda.

## Memulai Aplikasi

### Prasyarat
- Node.js (v18 ke atas disarankan)
- npm

### Instalasi & Menjalankan Aplikasi
```bash
# Instal dependensi
npm install

# Jalankan development server
npm run dev
```

Aplikasi dapat diakses pada browser di: `http://localhost:3000/`

## Lisensi & Hak Cipta
Powered by **PT. Manggala Utama Indonesia - Solusi Sistem Terintegrasi 2026**

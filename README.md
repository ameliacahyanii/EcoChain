# EcoChain — Platform Agregator Rantai Pasok Sirkular Berbasis AI

EcoChain adalah platform agregator rantai pasok sirkular berbasis AI yang menghubungkan penghasil limbah rumah tangga, pemulung, dan pengepul langsung dengan industri daur ulang di Indonesia.

Model bisnis EcoChain bersifat **asset-light**: EcoChain tidak memiliki armada atau gudang fisik sendiri, melainkan memberdayakan jaringan pengepul dan pemulung lokal dengan dukungan teknologi untuk standardisasi harga pasar dan keamanan transaksi.

---

## 🌟 Fitur Fitur Utama (Branding EcoChain)

1. 🔍 **EcoScan AI** (`/scan`) — Pemindai foto sampah/barang bekas berbasis AI Gemini yang mengidentifikasi kategori limbah, estimasi berat, dan nilai pasar secara otomatis.
2. 🛠️ **EcoGuide** (`/ecoguide`) — Panduan pembongkaran aman e-waste (elektronik bekas) bertahap untuk mengekstraksi komponen bernilai tinggi (tembaga, RAM, baterai lithium).
3. 🚚 **EcoRoute** (`/pickup`) — Sistem penjemputan _on-demand_ berbasis lokasi GPS dengan **Multi-Tier Fallback Engine** (Tier 1: Radius 2km Pemulung Mitra $\rightarrow$ Tier 2: Radius 5km $\rightarrow$ Tier 3: Kurir Cadangan).
4. 📦 **EcoHub** (`/dashboard/pengepul`) — Dashboard untuk pengepul mitra untuk mengelola inventaris stok gudang, grafik analitik volume masuk 7 hari, dan konsolidasi tonase.
5. 🔒 **EcoVault** — Mekanisme _escrow_ (rekening bersama) khusus transaksi B2B bertonase besar dari pengepul ke pabrik daur ulang untuk menjamin keamanan pembayaran.
6. 📊 **EcoTrack** (`/dashboard/impact`) — Dashboard dampak lingkungan real-time untuk mencatat tonase daur ulang, estimasi reduksi karbon (CO₂e), serta ekspor laporan kepatuhan ESG korporasi.

---

## 👥 Empat Peran Pengguna (Roles)

- **Rumah Tangga / Penyetor**: Ingin menjual limbah anorganik / elektronik bekas dengan harga transparan dan proses penjemputan mudah.
- **Pemulung (Kurir EcoRoute)**: Berperan ganda merespons permintaan jemput _on-demand_ di sekitar rute kerjanya. UX dirancang ultra-sederhana (ikon besar + teks label, tap target $\ge 48\times48\text{px}$).
- **Pengepul Mitra**: Konsolidasi stok hasil penyetoran dan menjual ke industri dalam tonase besar via EcoVault.
- **Industri Daur Ulang & Admin**: Pasokan bahan baku terverifikasi, verifikasi mitra, dan pelaporan ESG/EPR.

---

## 🎨 Design System & Prinsip UX

- **Warna Utama**:
  - `Primary (Hijau)`: `#16A34A` (Hover: `#15803D`) — Tombol Utama / CTA
  - `Secondary (Teal)`: `#0D9488` — Elemen AI (EcoScan) & Analitik
  - `Accent (Kuning Keemasan)`: `#F59E0B` — Highlight Harga / Nilai (PENTING: Selalu menggunakan teks warna gelap `#111827` di atas warna ini untuk kontras rasio $>4.5:1$)
  - `Danger (Merah)`: `#DC2626` — Error / Pembatalan
- **Tipografi**:
  - Body Text: `Inter`
  - Headings: `Poppins`
  - Font Base: **16px** (tidak ada teks di bawah 14px di seluruh UI)
- **Aksesibilitas Pemulung**:
  - Semua tombol interaktif minimal **48x48px**.
  - Setiap ikon WAJIB disertai teks label.
  - Alur tugas utama maksimal 3 langkah linear.

---

## 🛠️ Teknologi & Dependencies

- **Framework**: Next.js 16 (App Router) & React 19
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS v4 & Lucide React Icons
- **AI Engine**: Google GenAI SDK (`@google/genai`)
- **Database & Auth**: Supabase PostgreSQL & `@supabase/supabase-js`
- **Visualisasi Data**: `recharts`

---

## 📋 Pengaturan Environment Variables (`.env.local`)

Buat berkas `.env.local` di direktori utama proyek dan isi variabel berikut:

```env
# Credentials Supabase API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Koneksi Database PostgreSQL Supabase
DATABASE_URL=postgresql://postgres.user:password@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres

# Credentials Payment Gateway Midtrans (EcoVault Escrow)
MIDTRANS_SERVER_KEY=your_midtrans_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key

# Kunci API Gemini untuk AI Scanner (EcoScan)
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🗄️ Jalankan Migrasi Database Supabase

Seluruh skema database PostgreSQL, enum custom, fungsi trigger `handle_new_user`, aturan Row Level Security (RLS), dan seed data telah disiapkan dalam satu berkas SQL:

1. Buka [Supabase Dashboard](https://app.supabase.com) proyek Anda.
2. Buka menu **SQL Editor**.
3. Salin seluruh isi dari berkas:
   - `supabase/migrations/20260731000000_ecotrade_schema.sql` (atau `lib/db_migration.sql`)
4. Tempel ke SQL Editor dan tekan **Run**.

### Struktur 8 Tabel Utama:

- `profiles`: Data pengguna & role (rumah_tangga, pemulung, pengepul, admin)
- `waste_categories`: Katalog limbah & acuan harga standar nasional
- `scan_results`: Riwayat deteksi foto limbah oleh EcoScan AI
- `transactions`: Transaksi penyetoran limbah (Drop-off & On-demand Pickup)
- `pickup_requests`: Permintaan jemput EcoRoute & tracking status real-time
- `ecopoints`: Lokasi fisik titik penyetoran / lapak konsolidasi
- `b2b_orders`: Transaksi tonase besar pengepul ke pabrik (EcoVault Escrow)
- `impact_logs`: Log reduksi CO₂e & tonase daur ulang (EcoTrack ESG)

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

### 1. Install Dependensi

```bash
npm install
```

### 2. Jalankan Server Pengembangan (Development Mode)

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

> 💡 **Tips Pengujian (Demo Role Switcher)**:
> Pada bagian kanan atas header navigasi, gunakan dropdown **Peran** untuk beralih secara instant antara tampilan _Rumah Tangga_, _Pemulung (Kurir EcoRoute)_, _Pengepul Mitra_, dan _Admin_.

### 3. Jalankan Production Build Check

```bash
npm run build
npm run start
```

---

## 📄 Lisensi & Hak Cipta

Hak Cipta &copy; 2026 **EcoChain Indonesia**. Platform Agregator Rantai Pasok Sirkular Berbasis AI.

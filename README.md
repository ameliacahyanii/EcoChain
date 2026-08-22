# ♻️ EcoChain — Platform Agregator Rantai Pasok Sirkular Berbasis AI

> **EcoChain** adalah platform agregator rantai pasok sirkular berbasis kecerdasan buatan (AI) yang menghubungkan penghasil limbah rumah tangga, pemulung mitra, dan pengepul lokal secara langsung dengan industri daur ulang di Indonesia.

---

## 📌 Executive Summary & Model Bisnis

EcoChain beroperasi secara **asset-light**: 
- 🚫 **Tanpa Gudang & Armada Fisik Own-Account**: EcoChain tidak memiliki armada truk atau gudang pengumpulan sendiri.
- 🤝 **Memberdayakan Ekosistem Lokal**: Memanfaatkan jaringan pemulung dan lapak pengepul yang sudah ada dengan melengkapinya menggunakan teknologi AI.
- ⚖️ **Standardisasi & Keamanan**: Menghadirkan standardisasi harga pasar transparan, pemindaian jenis material otomatis, serta mekanisme *escrow payment* (rekening bersama) aman untuk transaksi tonase besar B2B.

---

## 🚀 Fitur-Fitur Utama (EcoChain Suite)

1. 🔍 **EcoScan AI** (`/scan`) — Pemindai foto sampah & rongsokan berbasis **Multi-Stage AI Classification Pipeline**:
   - 👁️ **Stage 1 (OpenCV)**: Image quality check (Laplacian blur variance, luminance histogram, & resolusi).
   - 🤖 **Stage 2 (Gemini 2.5 Flash)**: Vision & NLP (identifikasi material, deteksi komponen berbahaya, & saran daur ulang).
   - 🧮 **Stage 3 (Rule Engine)**: Dynamic price database lookup & penyesuaian multiplier kondisi material.
   - 🛡️ **Stage 4 (Confidence Gate)**: Decision layer ($\ge 0.75$ confidence) untuk penetapan harga otomatis vs eskalasi ke operator EcoPoint.
2. 🛠️ **EcoGuide AI** (`/ecoguide`) — Panduan pembongkaran aman *e-waste* (elektronik bekas) bertahap untuk mengekstraksi komponen bernilai ekonomi tinggi (tembaga, PCB/RAM, baterai lithium).
3. 🚚 **EcoRoute** (`/pickup`) — Engine penjemputan *on-demand* berbasis koordinat GPS dengan **Multi-Tier Radius Fallback Engine** (Tier 1: Radius 2km Pemulung Mitra $\rightarrow$ Tier 2: Radius 5km $\rightarrow$ Tier 3: Kurir 3PL).
4. 📦 **EcoHub** (`/dashboard/pengepul`) — Dashboard manajemen inventaris gudang pengepul mitra untuk konsolidasi stok, analitik volume masuk 7 hari, dan pembentukan order tonase besar.
5. 🔒 **EcoVault** — Rekening bersama (*escrow payment*) khusus transaksi B2B bertonase besar dari pengepul ke pabrik daur ulang yang terintegrasi dengan Midtrans.
6. 📊 **EcoTrack** (`/dashboard/impact`) — Analytics dashboard dampak lingkungan real-time yang mengkalkulasi tonase daur ulang, reduksi emisi karbon ($\text{CO}_2\text{e}$), dan ekspor laporan kepatuhan ESG korporasi.

---

## 👥 Matriks Hak Akses & Peran Pengguna (Role Access Matrix)

EcoChain memiliki 4 peran pengguna (*User Roles*) utama yang dikontrol melalui sistem otorisasi terpusat:

| Peran (Role) | Deskripsi Utama | EcoScan | EcoRoute | EcoHub | EcoVault | EcoTrack ESG |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Rumah Tangga / Penyetor** | Menjual limbah anorganik & e-waste dengan harga transparan dan penjemputan *on-demand*. | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Pemulung (Kurir EcoRoute)** | Merespons permintaan penjemputan di sekitar rute kerjanya (UX Ultra-Simpel: Tombol $\ge 48\times48\text{px}$). | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Pengepul Mitra** | Mengkonsolidasi stok limbah dari pemulung & menjual ke industri dalam tonase besar via EcoVault. | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Industri Daur Ulang & Admin** | Pembeli bahan baku terverifikasi, penguji mutu lab, serta pengelola laporan ESG/EPR korporasi. | ✅ | ❌ | ✅ | ✅ | ✅ |

---

## 🛠️ Arsitektur & Teknologi (Tech Stack)

```
EcoChain Ecosystem
├── Frontend & Framework : Next.js 16 (App Router), React 19, TypeScript
├── Styling & Design System : Tailwind CSS v4, Lucide React Icons
├── AI & Vision Pipeline : 4-Stage Classification Engine:
│                          1. OpenCV Image Quality Processing (Laplacian Blur & Luminance)
│                          2. Google Gemini 2.5 Flash (Multimodal Vision & NLP Safety)
│                          3. Knowledge Lookup & Rule Engine (Condition Multiplier Matrix)
│                          4. Confidence Gate (Decision Layer & EcoPoint Operator Escalate)
├── Database & Auth      : Supabase PostgreSQL, @supabase/supabase-js
├── Payment & Escrow     : Midtrans Payment Gateway (EcoVault)
├── Data Visualization   : Recharts
└── Modeling & Diagrams  : PlantUML (Activity & Sequence Diagrams)
```

---

## 🧠 Detail Arsitektur AI (AI Engine Specification)

EcoChain mengintegrasikan kecerdasan buatan pada 5 lapisan alur bisnis dengan **4-Stage Classification Pipeline** pada EcoScan:

```
[ Upload Foto Sampah / Limbah ]
              │
              ▼
    ┌─────────────────────────┐
    │ Stage 1: OpenCV Check   │ ◄── Laplacian Variance (Blur) + Luminance (Brightness)
    └──────────┬──────────────┘     Filtering Foto Buram/Gelap Sebelum Masuk Model
               │
               ▼
    ┌─────────────────────────┐
    │ Stage 2: Gemini Vision  │ ◄── Identifikasi Material, Grade Kondisi,
    └──────────┬──────────────┘     Deteksi Komponen Berbahaya & Recommendations NLP
               │
               ▼
    ┌─────────────────────────┐
    │ Stage 3: Rule Engine    │ ◄── Lookup Dynamic Price Database (waste_categories)
    └──────────┬──────────────┘     P_final = P_base * Multiplier_Kondisi * Safety_Factor
               │
               ▼
    ┌─────────────────────────┐
    │ Stage 4: Confidence Gate│ ◄── Confidence >= 0.75 & Clear Category Margin?
    └─────┬───────────────┬───┘
          │               │
      (Ya)│               │(Tidak / Confidence Rendah / Ambigu)
          ▼               ▼
┌───────────────────┐ ┌───────────────────────────────────┐
│ AUTOMATIC FINAL   │ │ ECOPOINT MANUAL VERIFICATION      │
│ PRICE             │ │ (Routing ke Operator EcoPoint)    │
└───────────────────┘ └───────────────────────────────────┘
              │
              ▼
    ┌──────────────────┐
    │ EcoRoute Engine  │ ◄── Haversine Distance + Multi-Tier Fallback (2km -> 5km -> 3PL)
    └─────────┬────────┘     Traveling Salesperson Problem (TSP) Optimization
              │
              ▼
    ┌──────────────────┐
    │ Fraud Detection  │ ◄── Rasio Densitas (Timbangan Fisik / Volume Visual AI)
    └─────────┬────────┘
              │
              ▼
    ┌──────────────────┐
    │ EcoTrack AI LCA  │ ◄── Reduksi CO2e = Sum(W_i * (EF_virgin - EF_recycled))
    └──────────────────┘
```

---

## 📐 Diagram PlantUML (System Diagrams)

Proyek ini dilengkapi dengan berkas spesifikasi PlantUML lengkap untuk pemetaan arsitektur bisnis dan teknikal:

- 📑 **[flowchart.puml](file:///Users/rafkiyuda/Documents/Source/ecochain-ai/flowchart.puml)** — PlantUML Activity Diagram yang menggambarkan seluruh alur proses bisnis & keputusan AI dari Rumah Tangga hingga Industri.
- 📑 **[sequence.puml](file:///Users/rafkiyuda/Documents/Source/ecochain-ai/sequence.puml)** — PlantUML Sequence Diagram yang mendokumentasikan alur komunikasi API & database antar komponen (Next.js, Gemini API, Supabase, Midtrans).

---

## 📂 Struktur Direktori Proyek (Folder Structure)

```
ecochain-ai/
├── app/
│   ├── api/
│   │   ├── ecohub/            # API Route konsolidasi stok & B2B order
│   │   ├── pickup/            # EcoRoute Multi-Tier Dispatching API (Haversine)
│   │   └── scan/              # EcoScan AI Route (Gemini 2.5 Flash SDK)
│   ├── dashboard/             # Client-side Dashboard Routes per Role
│   │   ├── impact/            # Dashboard EcoTrack ESG Carbon Analytics
│   │   └── pengepul/          # Dashboard EcoHub Pengepul Mitra
│   ├── ecoguide/              # Page Panduan Pembongkaran E-Waste
│   ├── pickup/                # Page Permintaan Penjemputan EcoRoute
│   ├── scan/                  # Page Pemindai Foto Limbah EcoScan
│   ├── globals.css            # Design tokens & Global Tailwind v4 styles
│   └── layout.tsx             # Root layout aplikasi
├── components/                # Reusable React UI Components
│   ├── ui/                    # Base UI elements (Buttons, Cards, Badges)
│   └── layout/                # Header Navbar, Role Switcher, Sidebar
├── lib/
│   ├── context/               # React Context & Role State Management
│   ├── db_migration.sql       # Schema SQL Lengkap Supabase (8 Tabel)
│   ├── supabase.ts            # Singleton Supabase Client Instance
│   ├── theme.ts               # Color Palette & Tokens (Green, Teal, Gold)
│   └── types.ts               # Shared TypeScript Interfaces & Enums
├── supabase/
│   └── migrations/            # Migration scripts PostgreSQL Supabase
├── flowchart.puml             # Diagram PlantUML Flowchart Bisnis & AI
├── sequence.puml              # Diagram PlantUML Sequence Teknikal
└── README.md                  # Dokumentasi Resmi Proyek
```

---

## 🎨 Design System & Accessibility Rules

- **Warna Utama**:
  - `Primary (Hijau Eco)`: `#16A34A` (Hover: `#15803D`) — Tombol Utama / Call-to-Action
  - `Secondary (Teal AI)`: `#0D9488` — Elemen AI (EcoScan) & Grafik Analitik
  - `Accent (Kuning Keemasan)`: `#F59E0B` — Highlight Harga & Nilai Ekonomi
  - `Danger (Merah Alert)`: `#DC2626` — Notifikasi Anomali / Batal
- **Desain Khusus Pemulung (Accessibility First)**:
  - Ukuran target sentuh tombol interaktif minimal **$48 \times 48 \text{ px}$**.
  - Setiap ikon wajib disertai teks deskriptif yang jelas.
  - Maksimalkan kontras teks (kontras rasio $> 4.5:1$).

---

## 📋 Pengaturan Environment Variables (`.env.local`)

Buat berkas `.env.local` di direktori utama proyek:

```env
# Credentials Supabase API & PostgreSQL Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://postgres.user:password@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres

# Credentials Payment Gateway Midtrans (EcoVault Escrow)
MIDTRANS_SERVER_KEY=your_midtrans_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key

# Kunci API Google Gemini untuk AI Scanner (EcoScan)
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🗄️ Migrasi Database Supabase

Seluruh skema database PostgreSQL, enum custom, fungsi trigger `handle_new_user`, aturan Row Level Security (RLS), dan seed data telah disiapkan dalam berkas SQL:

1. Buka [Supabase Dashboard](https://app.supabase.com) proyek Anda.
2. Pilih menu **SQL Editor**.
3. Salin seluruh konten dari berkas [lib/db_migration.sql](file:///Users/rafkiyuda/Documents/Source/ecochain-ai/lib/db_migration.sql) (atau `supabase/migrations/20260731000000_ecotrade_schema.sql`).
4. Tempel ke SQL Editor dan tekan **Run**.

### Ringkasan 8 Tabel Utama Database:
- `profiles`: Data pengguna & penetapan peran (*rumah_tangga, pemulung, pengepul, admin*).
- `waste_categories`: Katalog limbah & acuan harga standar nasional.
- `scan_results`: Riwayat hasil pemindaian foto oleh EcoScan AI.
- `transactions`: Log transaksi penyetoran limbah (Drop-off & On-demand).
- `pickup_requests`: Permintaan jemput EcoRoute & pelacakan status real-time.
- `ecopoints`: Lokasi fisik titik penyetoran / lapak konsolidasi pengepul.
- `b2b_orders`: Transaksi tonase besar pengepul ke pabrik (EcoVault Escrow).
- `impact_logs`: Log reduksi $\text{CO}_2\text{e}$ & tonase daur ulang (EcoTrack ESG).

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Install Dependensi
```bash
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

> 💡 **Demo Role Switcher**:
> Pada bagian kanan atas header aplikasi, gunakan dropdown **Peran** untuk beralih secara instan antara tampilan *Rumah Tangga*, *Pemulung (Kurir EcoRoute)*, *Pengepul Mitra*, dan *Admin/Industri*.

### 3. Pemeriksaan Kode & Production Build
```bash
# Validasi Linting & Type Check
npx eslint .
npx tsc --noEmit

# Build bundle produksi
npm run build
npm run start
```

---

## 📄 Lisensi & Hak Cipta

Hak Cipta &copy; 2026 **EcoChain Indonesia**. Platform Agregator Rantai Pasok Sirkular Berbasis AI. All rights reserved.

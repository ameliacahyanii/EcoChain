-- ====================================================================
-- ECOTRADE DATABASE MIGRATION SCRIPT FOR SUPABASE
-- Platform Agregator Rantai Pasok Sirkular Berbasis AI
-- ====================================================================

-- 1. EXTENSIONS & CUSTOM ENUM TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM (
  'rumah_tangga',
  'pemulung',
  'pengepul',
  'admin'
);

CREATE TYPE waste_category_group AS ENUM (
  'plastik',
  'kertas',
  'logam',
  'elektronik',
  'lainnya'
);

CREATE TYPE transaction_type AS ENUM (
  'drop_off',
  'pickup'
);

CREATE TYPE transaction_status AS ENUM (
  'pending',
  'confirmed',
  'completed',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'unpaid',
  'paid'
);

CREATE TYPE pickup_status AS ENUM (
  'searching',
  'assigned',
  'on_the_way',
  'completed',
  'cancelled',
  'fallback_kurir'
);

CREATE TYPE escrow_status AS ENUM (
  'funded',
  'held',
  'released',
  'disputed',
  'refunded'
);

-- ====================================================================
-- 2. TABEL: profiles
-- Menyimpan informasi pengguna (Rumah Tangga, Pemulung, Pengepul, Admin)
-- ====================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE,
  role user_role NOT NULL DEFAULT 'rumah_tangga',
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_verified_partner BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'Profil pengguna EcoTrade (Rumah Tangga, Pemulung/Kurir EcoRoute, Pengepul, Admin)';
COMMENT ON COLUMN profiles.is_verified_partner IS 'Status verifikasi resmi untuk pemulung mitra & pengepul mitra';

-- ====================================================================
-- 3. TABEL: waste_categories
-- Katalog kategori limbah & acuan harga pasar nasional
-- ====================================================================
CREATE TABLE waste_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg', -- 'kg' atau 'unit'
  base_price_per_unit NUMERIC(12, 2) NOT NULL DEFAULT 0,
  category_group waste_category_group NOT NULL DEFAULT 'lainnya',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE waste_categories IS 'Katalog kategori sampah & acuan harga standar pasar per unit';

-- ====================================================================
-- 4. TABEL: scan_results
-- Hasil pemindaian foto AI Gemini (EcoScan)
-- ====================================================================
CREATE TABLE scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  detected_category_id UUID REFERENCES waste_categories(id) ON DELETE SET NULL,
  estimated_weight_kg NUMERIC(8, 2),
  estimated_price NUMERIC(12, 2),
  ai_confidence NUMERIC(5, 2), -- 0.00 hingga 100.00 %
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE scan_results IS 'Riwayat deteksi foto limbah oleh EcoScan AI';

-- ====================================================================
-- 5. TABEL: transactions
-- Transaksi jual-beli rongsok/sampah antara seller & buyer
-- ====================================================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  scan_result_id UUID REFERENCES scan_results(id) ON DELETE SET NULL,
  final_weight_kg NUMERIC(8, 2) NOT NULL,
  final_price NUMERIC(12, 2) NOT NULL,
  transaction_type transaction_type NOT NULL DEFAULT 'drop_off',
  status transaction_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

COMMENT ON TABLE transactions IS 'Transaksi riil penyetoran limbah (Drop-off di EcoPoint atau On-demand Pickup)';

-- ====================================================================
-- 6. TABEL: pickup_requests
-- Permintaan penjemputan sampah on-demand (EcoRoute)
-- ====================================================================
CREATE TABLE pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES profiles(id),
  assigned_pemulung_id UUID REFERENCES profiles(id),
  pickup_address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  preferred_time TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
  status pickup_status NOT NULL DEFAULT 'searching',
  fallback_tier INTEGER NOT NULL DEFAULT 1, -- 1=Pemulung terdekat, 2=Operator EcoPoint, 3=Kurir Cadangan
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE pickup_requests IS 'Permintaan jemput on-demand berbasis lokasi terdekat ke Pemulung Mitra';

-- ====================================================================
-- 7. TABEL: ecopoints
-- Lokasi fisik titik penyetoran / lapak konsolidasi (EcoHub / Lapak)
-- ====================================================================
CREATE TABLE ecopoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  operator_id UUID NOT NULL REFERENCES profiles(id),
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE ecopoints IS 'Titik penampungan fisik & lapak mitra pengepul';

-- ====================================================================
-- 8. TABEL: b2b_orders
-- Transaksi tonase besar pengepul ke industri daur ulang (EcoVault Escrow)
-- ====================================================================
CREATE TABLE b2b_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pengepul_id UUID NOT NULL REFERENCES profiles(id),
  buyer_company_name TEXT NOT NULL,
  total_weight_kg NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(14, 2) NOT NULL,
  escrow_status escrow_status NOT NULL DEFAULT 'funded',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  released_at TIMESTAMPTZ
);

COMMENT ON TABLE b2b_orders IS 'Transaksi B2B bertonase besar dengan mekanisme rekening bersama (EcoVault)';

-- ====================================================================
-- 9. TABEL: impact_logs
-- Log jejak dampak lingkungan & reduksi CO2 (EcoTrack ESG)
-- ====================================================================
CREATE TABLE impact_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  waste_category_id UUID NOT NULL REFERENCES waste_categories(id),
  weight_kg NUMERIC(10, 2) NOT NULL,
  estimated_co2_reduction_kg NUMERIC(10, 2) NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE impact_logs IS 'Log reduksi karbon & tonase daur ulang untuk ESG reporting';

-- ====================================================================
-- 10. TRIGGER AUTOMATIS: Auto Create Profile saat User SignUp
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Pengguna EcoTrade'),
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'rumah_tangga')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS di semua tabel
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecopoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_logs ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- Policies: profiles
-- User bisa lihat profil publik/pengepul, tapi hanya bisa ubah profilnya sendiri
-- --------------------------------------------------------------------
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- --------------------------------------------------------------------
-- Policies: waste_categories
-- Public read, hanya Admin yang bisa insert/update/delete
-- --------------------------------------------------------------------
CREATE POLICY "Waste categories are viewable by everyone"
  ON waste_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can insert waste categories"
  ON waste_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can update waste categories"
  ON waste_categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- --------------------------------------------------------------------
-- Policies: scan_results
-- User hanya bisa lihat dan buat scan_result milik mereka sendiri
-- --------------------------------------------------------------------
CREATE POLICY "Users can view their own scan results"
  ON scan_results FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own scan results"
  ON scan_results FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- --------------------------------------------------------------------
-- Policies: transactions
-- User hanya bisa melihat transaksi yang melibatkan dirinya (sebagai seller/buyer)
-- --------------------------------------------------------------------
CREATE POLICY "Users can view transactions involving them"
  ON transactions FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid() OR buyer_id = auth.uid());

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid() OR buyer_id = auth.uid());

CREATE POLICY "Users can update transactions involving them"
  ON transactions FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid() OR buyer_id = auth.uid());

-- --------------------------------------------------------------------
-- Policies: pickup_requests
-- Requester atau pemulung yang diassign yang bisa melihat/update
-- --------------------------------------------------------------------
CREATE POLICY "Users can view relevant pickup requests"
  ON pickup_requests FOR SELECT
  TO authenticated
  USING (
    requester_id = auth.uid() OR 
    assigned_pemulung_id = auth.uid() OR
    status = 'searching' -- Pemulung bisa cari request aktif
  );

CREATE POLICY "Requester can create pickup request"
  ON pickup_requests FOR INSERT
  TO authenticated
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Relevant users can update pickup request"
  ON pickup_requests FOR UPDATE
  TO authenticated
  USING (requester_id = auth.uid() OR assigned_pemulung_id = auth.uid() OR status = 'searching');

-- --------------------------------------------------------------------
-- Policies: ecopoints
-- Public read, operator/admin update
-- --------------------------------------------------------------------
CREATE POLICY "EcoPoints viewable by everyone"
  ON ecopoints FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Operators and admin can manage ecopoints"
  ON ecopoints FOR ALL
  TO authenticated
  USING (operator_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- --------------------------------------------------------------------
-- Policies: b2b_orders (EcoVault Escrow)
-- Pengepul pemilik order bisa lihat dan kelola
-- --------------------------------------------------------------------
CREATE POLICY "Pengepul can view their B2B orders"
  ON b2b_orders FOR SELECT
  TO authenticated
  USING (pengepul_id = auth.uid());

CREATE POLICY "Pengepul can create B2B orders"
  ON b2b_orders FOR INSERT
  TO authenticated
  WITH CHECK (pengepul_id = auth.uid());

-- --------------------------------------------------------------------
-- Policies: impact_logs (EcoTrack)
-- Public read untuk statistik ESG
-- --------------------------------------------------------------------
CREATE POLICY "Impact logs viewable by everyone"
  ON impact_logs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can log impact"
  ON impact_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ====================================================================
-- 12. SEED DATA: Kategori Sampah & Harga Pasar Acuan
-- ====================================================================
INSERT INTO waste_categories (name, unit, base_price_per_unit, category_group) VALUES
  ('Plastik PET (Botol Bening)', 'kg', 4500.00, 'plastik'),
  ('Plastik HDPE (Tutup/Baskom)', 'kg', 3800.00, 'plastik'),
  ('Kertas Kardus Cokelat', 'kg', 2200.00, 'kertas'),
  ('Kertas HVS Bekas', 'kg', 2500.00, 'kertas'),
  ('Logam Tembaga Super', 'kg', 95000.00, 'logam'),
  ('Logam Aluminium Kaleng', 'kg', 14000.00, 'logam'),
  ('Besi Tua / Rongsok', 'kg', 4000.00, 'logam'),
  ('Elektronik - Laptop Bekas', 'unit', 150000.00, 'elektronik'),
  ('Elektronik - Smartphone PCB', 'unit', 35000.00, 'elektronik'),
  ('Minyak Jelantah', 'kg', 7500.00, 'lainnya');

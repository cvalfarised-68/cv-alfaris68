-- ====================================================================
-- CV. ALFARIS ENAM DELAPAN - SISTEM MANAJEMEN DISTRIBUSI ROTI
-- SUPABASE POSTGRESQL DATABASE SCHEMA & MIGRATION SCRIPT
-- ====================================================================
-- Petunjuk:
-- 1. Buka dashboard project Anda di https://supabase.com
-- 2. Pilih menu "SQL Editor" di bilah navigasi samping kiri
-- 3. Buat query baru ("New Query"), copy-paste seluruh isi file ini, lalu klik "Run"
-- ====================================================================

-- 1. TABEL SALES (Master Data Sales Keliling & Luar Kota)
CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    route TEXT,
    status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. TABEL PRODUCTS (Master Produk Roti & 6 Level Harga)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 0,
    factory_price NUMERIC(15, 2) DEFAULT 0,
    prices JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. TABEL TRANSACTIONS (Transaksi Drop Barang & Piutang Kasbon Sales)
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    sales_id TEXT,
    sales_name TEXT NOT NULL,
    sales_phone TEXT,
    sales_route TEXT,
    tier_name TEXT,
    payment_method TEXT CHECK (payment_method IN ('tunai', 'transfer', 'kasbon')),
    payment_status TEXT CHECK (payment_status IN ('lunas', 'belum_lunas')),
    due_date TEXT,
    total_qty INTEGER DEFAULT 0,
    total_amount NUMERIC(15, 2) DEFAULT 0,
    total_factory_cost NUMERIC(15, 2) DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. TABEL EXPENSES (Buku Pengeluaran Operasional & Tabungan)
CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT,
    amount NUMERIC(15, 2) DEFAULT 0,
    "desc" TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. TABEL RETUR (Retur Roti Khusus Toko Langsung)
CREATE TABLE IF NOT EXISTS retur (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    toko_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    qty INTEGER DEFAULT 0,
    reason TEXT,
    action_type TEXT CHECK (action_type IN ('pabrik', 'waste')),
    waste_hpp_amount NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. TABEL TOKO_LANGSUNG (Monitoring Toko & Deteksi Rute Kosong)
CREATE TABLE IF NOT EXISTS toko_langsung (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    pic TEXT,
    phone TEXT,
    route TEXT,
    sales_name TEXT,
    last_visit_date TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. TABEL PO_SALES (Rekapitulasi Pre-Order Roti Sales & Pabrik)
CREATE TABLE IF NOT EXISTS po_sales (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    sales_id TEXT,
    sales_name TEXT NOT NULL,
    sales_route TEXT,
    items JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ====================================================================
-- PERMISSIONS & PRIVILEGES (GRANT AKSES KE ROLE ANON / PUBLISHABLE KEY)
-- ====================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Memberikan izin SELECT, INSERT, UPDATE, DELETE untuk publik/anon
-- ====================================================================
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE retur ENABLE ROW LEVEL SECURITY;
ALTER TABLE toko_langsung ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_sales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access for sales" ON sales;
CREATE POLICY "Public access for sales" ON sales FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for products" ON products;
CREATE POLICY "Public access for products" ON products FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for transactions" ON transactions;
CREATE POLICY "Public access for transactions" ON transactions FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for expenses" ON expenses;
CREATE POLICY "Public access for expenses" ON expenses FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for retur" ON retur;
CREATE POLICY "Public access for retur" ON retur FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for toko_langsung" ON toko_langsung;
CREATE POLICY "Public access for toko_langsung" ON toko_langsung FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for po_sales" ON po_sales;
CREATE POLICY "Public access for po_sales" ON po_sales FOR ALL TO public USING (true) WITH CHECK (true);

-- ====================================================================
-- REALTIME REPLICATION
-- Aktifkan Realtime agar setiap perubahan data disiarkan otomatis ke seluruh layar HP & Laptop
-- ====================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE sales, products, transactions, expenses, retur, toko_langsung, po_sales;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL; -- abaikan jika sudah pernah ditambahkan
  END;
END $$;

-- ====================================================================
-- DATA AWAL (SEED DATA CV. ALFARIS ENAM DELAPAN)
-- ====================================================================
INSERT INTO sales (id, name, phone, route, status) VALUES
('SLS-001', 'Budi Santoso', '081234567890', 'Pasar Besar - Dinoyo', 'aktif'),
('SLS-002', 'Agus Wahyudi', '085798761234', 'Sukun - Kepanjen', 'aktif'),
('SLS-003', 'Rian Dani', '082144556677', 'Singosari - Lawang', 'aktif'),
('SLS-004', 'Hendra Saputra', '083811223344', 'Blimbing - Sawojajar', 'aktif')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, code, name, category, stock, factory_price, prices) VALUES
('PRD-001', 'ROTI-MC-01', 'Roti Manis Coklat Lumer', 'Roti Manis', 850, 3500, '{"level1": 4400, "level2": 4600, "level3": 4800, "level4": 5100, "level5": 4500, "level6": 4200}'::jsonb),
('PRD-002', 'ROTI-MK-02', 'Roti Manis Keju Spesial', 'Roti Manis', 620, 3700, '{"level1": 4600, "level2": 4800, "level3": 5000, "level4": 5400, "level5": 4750, "level6": 4450}'::jsonb),
('PRD-003', 'ROTI-TW-03', 'Roti Tawar Kupas Premium', 'Roti Tawar', 410, 8500, '{"level1": 10600, "level2": 11000, "level3": 11500, "level4": 12500, "level5": 10900, "level6": 10200}'::jsonb),
('PRD-004', 'ROTI-SS-04', 'Roti Sisir Mentega Jadul', 'Roti Sisir', 300, 4200, '{"level1": 5250, "level2": 5500, "level3": 5700, "level4": 6100, "level5": 5400, "level6": 5050}'::jsonb),
('PRD-005', 'ROTI-SB-05', 'Roti Sobek Coklat Keju', 'Roti Sobek', 80, 9000, '{"level1": 11250, "level2": 11700, "level3": 12200, "level4": 13000, "level5": 11500, "level6": 10800}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO toko_langsung (id, name, pic, phone, route, sales_name, last_visit_date) VALUES
('TKO-001', 'Toko Berkah Dinoyo', 'Ibu Hj. Aminah', '081233445566', 'Pasar Besar - Dinoyo', 'Budi Santoso', TO_CHAR(NOW() - INTERVAL '8 days', 'YYYY-MM-DD')),
('TKO-002', 'Minimarket Barokah Kepanjen', 'Pak Gunawan', '085711223344', 'Sukun - Kepanjen', 'Agus Wahyudi', TO_CHAR(NOW() - INTERVAL '5 days', 'YYYY-MM-DD')),
('TKO-003', 'Toko Rejeki Singosari', 'Pak Bambang', '082199887766', 'Singosari - Lawang', 'Rian Dani', TO_CHAR(NOW() - INTERVAL '1 days', 'YYYY-MM-DD')),
('TKO-004', 'Toko Sentosa Lawang Indah', 'Ibu Ratna', '081955667788', 'Singosari - Lawang', 'Rian Dani', TO_CHAR(NOW() - INTERVAL '10 days', 'YYYY-MM-DD'))
ON CONFLICT (id) DO NOTHING;

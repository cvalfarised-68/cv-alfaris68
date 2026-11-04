-- ====================================================================
-- CV. ALFARIS ENAM DELAPAN - FIX SUPABASE TABLE PERMISSIONS
-- ====================================================================
-- Buka Supabase Dashboard > SQL Editor > New Query > Tempel & Klik RUN

-- 1. Berikan hak akses ke skema public
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Berikan hak penuh ke seluruh tabel untuk role anon (publishable key)
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 3. Atur hak default untuk tabel baru
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 4. Pastikan Row Level Security (RLS) mengizinkan akses publik
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

# CV. Alfaris Enam Delapan - Sistem Manajemen Distribusi Roti 🍞🚚

Aplikasi web Single Page Application (SPA) modern, cepat, dan mobile-friendly untuk operasional distributor roti **CV. Alfaris Enam Delapan**. Dirancang untuk kasir toko, armada sales keliling, dan dashboard keuangan khusus Owner.

---

## ✨ Fitur Unggulan

1. **Role Switcher & Proteksi Kerahasiaan (Owner vs Kasir)**:
   - **Mode Kasir**: Menampilkan transaksi kasir, input kasbon, dan operasional harian, menyembunyikan harga kulakan pabrik dan laba bersih.
   - **Mode Owner**: Membuka seluruh kalkulasi keuangan, HPP pabrik, biaya operasional, dan Laba Bersih riil.
2. **Master Produk & 6 Level Harga Otomatis**:
   - Level 1: Sales Besar
   - Level 2: Sales Sedang
   - Level 3: Sales Kecil
   - Level 4: Toko Kirim Langsung
   - Level 5: Agen Khusus
   - Level 6: Grosir Partai
3. **Transaksi Drop Barang & Kasbon Tempo 3 Hari**:
   - Drop barang multi-varian, kasbon dengan deteksi status (Aman, Jatuh Tempo H-1, Lewat Tempo).
   - Generate otomatis **Nota WhatsApp ber-Kop CV. Alfaris Enam Delapan**.
4. **Rekap PO Sales & Matrix Pabrik**:
   - Akumulasi Pre-Order per sales untuk tanggal yang dipilih (Hari Ini, Besok, Lusa).
   - Baris footer otomatis menghitung jumlah total pcs masing-masing varian yang harus diambil dari pabrik roti.
   - Tombol satu-klik untuk mengirim pesan pesanan resmi ke WhatsApp Pabrik.
5. **Retur Roti Khusus Toko Langsung**:
   - Pemisahan perlakuan retur: **Tukar Guling ke Pabrik (Rp 0 kerugian)** vs **Waste Ditanggung Sendiri** (otomatis memotong laba bersih).
6. **Deteksi Rute Kosong & Kunjungan Toko**:
   - Memonitor toko mitra langsung yang belum dikunjungi >3 hari atau >7 hari.
7. **Buku Biaya Operasional & Laporan Laba Rugi Owner**:
   - Catatan Sewa Mobil, Solar BBM, Gaji 4 Karyawan, Pajak, dan Alokasi Tabungan Mingguan.
   - Laba Bersih = $(Total\ Penjualan - Total\ Kulakan\ Pabrik) - Operasional - Tabungan$.
8. **Sinkronisasi Database Cloud Supabase (Real-Time)**:
   - Menggunakan arsitektur *Hybrid / Offline-First*: data disimpan di cache lokal (0ms respon) dan otomatis di-upsert ke database Postgres Supabase.
   - Realtime multi-perangkat: Transaksi dari HP Kasir langsung tampil di laptop Owner secara instan.
   - Backup Bulanan dalam format file JSON.

---

## 🚀 Panduan Setup Database Supabase

1. Daftar / Masuk ke akun Anda di [https://supabase.com](https://supabase.com).
2. Klik **New Project** dan buat project baru (misal: `cv-alfaris-distributor`).
3. Setelah database aktif, masuk ke menu **SQL Editor** di bilah kiri.
4. Buka file [`supabase_schema.sql`](./supabase_schema.sql), salin seluruh isinya, tempelkan ke SQL Editor, dan klik **Run**.
5. Masuk ke **Project Settings** > **API**:
   - Salin **Project URL** (contoh: `https://xyzcompany.supabase.co`).
   - Salin **anon public key** (contoh: `eyJhbGciOi...`).
6. Buka aplikasi CV. Alfaris Enam Delapan di browser, klik tombol **"Database Cloud Supabase"** di header atau menu samping, masukkan URL dan Key tersebut, lalu klik **"Simpan & Sambungkan ke Cloud"**.
7. Klik **"Upload Data Lokal"** untuk langsung memindahkan seluruh data master dan simulasi yang ada di browser ke tabel Supabase.

---

## 📦 Deployment ke GitHub & Vercel

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "feat: inisialisasi CV Alfaris Enam Delapan SPA dengan Supabase"
git branch -M main
git remote add origin https://github.com/<USERNAME-ANDA>/cv-alfaris-distributor.git
git push -u origin main
```

### 2. Deploy ke Vercel
1. Masuk ke [vercel.com](https://vercel.com).
2. Klik **Add New...** -> **Project**.
3. Hubungkan akun GitHub Anda dan pilih repository `cv-alfaris-distributor`.
4. Framework Preset: pilih **Other**.
5. Klik tombol **Deploy**.
6. Dalam hitungan detik, aplikasi web Anda aktif di domain publik seperti:
   `https://cv-alfaris-distributor.vercel.app`

---

## 🛠️ Teknologi yang Digunakan
- **HTML5 & Vanilla JavaScript (ES6+)** - Tanpa framework berat, super ringan & cepat dibuka di HP low-spec.
- **Tailwind CSS (via CDN)** - Tampilan responsif modern.
- **Lucide Icons** - Ikon bersih dan profesional.
- **@supabase/supabase-js v2** - Database Postgres Cloud & Realtime WebSocket.

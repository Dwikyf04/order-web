# TaHUtech

Website katalog dan pemesanan pengadaan barang sekolah/instansi.

## Arsitektur

- `src/domain`: aturan bisnis dan validasi.
- `src/application`: use-case dan React hooks aplikasi.
- `src/infrastructure`: Supabase, repository, storage, dan integrasi eksternal.
- `src/components` dan `src/pages`: presentation layer.
- `supabase/migrations`: schema, function, policy, dan audit database.
- `scripts/seed-catalog.mjs`: migrasi katalog lama ke database dan Supabase Storage.

## Setup lokal

1. Salin `.env.example` menjadi `.env`.
2. Isi `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, serta konfigurasi situs.
3. Jalankan migration `supabase/migrations/20260911000100_clean_order_architecture.sql` melalui Supabase SQL Editor atau Supabase CLI.
4. Buat user admin di Supabase Auth lalu tambahkan baris pada `profiles` dengan `role = 'admin'`.
5. Jalankan seed katalog menggunakan service-role key hanya dari mesin pengelola:

   ```bash
   $env:SUPABASE_URL="https://your-project.supabase.co"
   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   npm run catalog:seed
   ```

   Jangan pernah menaruh `SUPABASE_SERVICE_ROLE_KEY` di frontend, repository, atau environment variable `VITE_*`.

   Jika database lama memiliki tabel `orders_legacy`, migrasikan histori setelah katalog selesai:

   ```bash
   npm run orders:migrate
   ```

6. Jalankan aplikasi:

   ```bash
   npm install
   npm run dev
   ```

Validasi parser katalog tanpa koneksi database:

```bash
npm run catalog:seed -- --dry-run
```

Validasi invariant migration tanpa koneksi database:

```bash
npm run db:migration:check
```

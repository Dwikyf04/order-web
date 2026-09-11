// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase belum dikonfigurasi. Salin .env.example menjadi .env dan isi VITE_SUPABASE_URL serta VITE_SUPABASE_PUBLISHABLE_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // KUNCI KEAMANAN:
    // Menggunakan 'sessionStorage' agar data login hilang saat tab ditutup.
    storage: sessionStorage,

    // Opsi tambahan agar session berjalan lancar
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

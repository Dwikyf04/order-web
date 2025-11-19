// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Ambil URL dan ANON KEY dari Dashboard Supabase (Menu Project Settings -> API)
const supabaseUrl = "https://dboyajuuujqnsbiqsqef.supabase.co"; // Ganti dengan URL Projectmu
const supabaseKey = "sb_publishable_Xmt-drVrEoqI4H_hliW_1Q_7fIhg4Xf"; // Ganti dengan Anon Key Projectmu

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

// src/App.jsx

import React from 'react';
import './index.css'; // Pastikan file CSS Anda diimpor

// Nama fungsi sekarang adalah App, dan ini adalah SATU-SATUNYA export default
export default function App() {
  return (
    // Kita set background seluruh halaman menjadi abu-abu muda
    <div className="min-h-screen bg-slate-100"> 
      
      {/* ===== NAVBAR ===== */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-8">
          
          {/* Bagian Kiri: Logo */}
          <div className="text-2xl font-bold text-blue-700">
            CV. Sejahtera
          </div>

          {/* Bagian Tengah: Menu Navigasi */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-700">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-700">Katalog</a>
            <a href="#" className="text-blue-700 font-semibold border-b-2 border-blue-700">
              Pemesanan
            </a>
          </div>

          {/* Bagian Kanan: Ikon Keranjang & User */}
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-600 hover:text-blue-700">
              <span>🛒</span> 
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                1
              </span>
            </button>
            <button className="text-gray-600 hover:text-blue-700">
              <span>👤</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ===== KONTEN UTAMA ===== */}
      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- KOLOM KIRI (Form) --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* --- Card Masukkan Data Sekolah --- */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full">
                  1
                </span>
                <h2 className="text-xl font-semibold text-gray-800">Masukkan Data Sekolah</h2>
              </div>

              {/* Form Grid */}
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Sekolah */}
                <div>
                  <label htmlFor="nama-sekolah" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Sekolah
                  </label>
                  <input 
                    type="text" 
                    id="nama-sekolah" 
                    placeholder="Masukkan nama sekolah"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Nama Kontak */}
                <div>
                  <label htmlFor="nama-kontak" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kontak
                  </label>
                  <input 
                    type="text" 
                    id="nama-kontak" 
                    placeholder="Masukkan nama kontak"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Alamat Lengkap */}
                <div className="md:col-span-2">
                  <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea 
                    id="alamat" 
                    rows="4"
                    placeholder="Masukkan alamat lengkap sekolah"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                
                {/* No. Telepon */}
                <div>
                  <label htmlFor="telepon" className="block text-sm font-medium text-gray-700 mb-1">
                    No. Telepon
                  </label>
                  <input 
                    type="text" 
                    id="telepon" 
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Email (Opsional) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Opsional)
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="email@sekolah.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Tombol Lanjut */}
                <div className="md:col-span-2 text-right">
                  <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
                    Lanjut ke Pemilihan Produk
                  </button>
                </div>
              </form>
            </div>

            {/* --- Card Pilih Produk (Placeholder) --- */}
            <div className="bg-white p-6 rounded-lg shadow-lg opacity-50">
              <div className="flex items-center space-x-4 mb-6">
                <span className="flex items-center justify-center w-8 h-8 bg-gray-400 text-white font-bold rounded-full">
                  2
                </span>
                <h2 className="text-xl font-semibold text-gray-500">Pilih Produk</h2>
              </div>
            </div>

          </div>

          {/* --- KOLOM KANAN (Sidebar) --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card Ulasan dan rating */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Ulasan dan rating</h3>
              <p className="text-5xl font-bold text-gray-900">4.99</p>
              <div className="flex justify-center text-3xl text-yellow-400 my-2">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-sm text-gray-500">Berdasarkan total 11.231 rating</p>
            </div>

            {/* Card Butuh Bantuan? */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Butuh Bantuan?</h3>
              <p className="text-sm text-gray-500">Kamu bisa hubungi admin disini.</p>
            </div>

            {/* Card Ringkasan Pesanan */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Ringkasan Pesanan</h3>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Total Item:</span>
                <span className="font-semibold text-gray-900">1 produk</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-4">
                <span>Total Harga:</span>
                <span className="font-semibold text-blue-600">Rp 4,5</span>
              </div>
              <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-300">
                Pesan Sekarang!
              </button>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}

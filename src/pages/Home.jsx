// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom"; // Gunakan Link untuk navigasi

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Bagian Hero (Judul Utama) */}
      <div className="relative text-center py-32 px-4 bg-gray-100 rounded-lg">
        {/* Anda bisa tambahkan gambar background di sini nanti */}
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Partner Terpercaya
        </h1>
        <h2 className="text-5xl font-bold text-blue-700 mb-6">
          Pengadaan Sekolah
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          CV. Sejahtera menyediakan solusi pengadaan barang elektronik dan
          keperluan sekolah dengan sistem pemesanan yang mudah dan profesional.
        </p>
        <Link
          to="/pemesanan"
          className="bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg hover:bg-blue-800 transition-colors"
        >
          Mulai Pemesanan &rarr;
        </Link>
      </div>

      {/* Bagian Fitur (3 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-semibold mb-2">Terpercaya</h3>
          <p className="text-gray-600">Produk original dengan garansi resmi.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-semibold mb-2">Pengiriman Tepat Waktu</h3>
          <p className="text-gray-600">Proses cepat dan jadwal pasti.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-semibold mb-2">Harga Kompetitif</h3>
          <p className="text-gray-600">Penawaran terbaik untuk sekolah.</p>
        </div>
      </div>

      {/* Bagian Fitur (4 Kolom) */}
      <div className="text-center py-16 px-4 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Produk Unggulan Kami
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Jelajahi berbagai produk berkualitas yang kami tawarkan untuk memenuhi
          kebutuhan sekolah Anda.
        </p>
        <Link
          to="/pemesanan"
          className="bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg hover:bg-blue-800 transition-colors"
        >
          Lihat Katalog Produk &rarr;
        </Link>
      </div>
      {/* Bagian fitur about */}
      <div className="max-w-4xl mx-auto text-center py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Tentang Kami</h2>
        <p className="text-lg text-gray-600 mb-6">
          Kami adalah perusahaan yang bergerak di bidang pengadaan barang dengan
          fokus melayani kebutuhan institusi pendidikan. Dengan pengalaman
          bertahun-tahun, kami memahami kebutuhan sekolah akan produk
          berkualitas dengan harga yang kompetitif. Sistem pemesanan online kami
          memudahkan sekolah untuk melakukan pengadaan dengan proses yang
          transparan dan dokumentasi yang lengkap.
        </p>
      </div>
    </div>
  );
}

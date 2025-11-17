// src/pages/Home.jsx
import React from "react";
import {
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-24 px-6 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-sm">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Partner Terpercaya Pengadaan Sekolah
          </h1>
          <p className="text-lg text-gray-600 max-w-md mb-8">
            CV. Sejahtera menyediakan solusi pengadaan barang elektronik dan
            keperluan sekolah dengan proses pemesanan yang cepat, profesional,
            dan mudah.
          </p>

          <Link
            to="/pemesanan"
            className="bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            Mulai Pemesanan →
          </Link>
        </div>

        {/* Hero Illustration */}
        <div className="hidden md:flex justify-center">
          <img
            src="/img/hero-school.png"
            alt="school procurement"
            className="w-3/4 drop-shadow-xl"
          />
        </div>
      </div>

      {/* FITUR 3 CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-6">
        {[
          {
            icon: ShieldCheckIcon,
            title: "Terpercaya",
            text: "Produk original dengan garansi resmi.",
          },
          {
            icon: ClockIcon,
            title: "Pengiriman Tepat Waktu",
            text: "Proses cepat dan jadwal pasti.",
          },
          {
            icon: CurrencyDollarIcon,
            title: "Harga Kompetitif",
            text: "Penawaran terbaik untuk sekolah.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-2xl shadow-md border hover:shadow-xl hover:-translate-y-1 transition-all cursor-default flex flex-col items-center"
          >
            <item.icon className="h-14 w-14 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>

      {/* PRODUK UNGGULAN SECTION */}
      <div className="text-center py-16 px-6 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Produk Unggulan Kami
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Jelajahi berbagai produk berkualitas yang kami tawarkan untuk memenuhi
          kebutuhan sekolah Anda.
        </p>

        <Link
          to="/pemesanan"
          className="bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg"
        >
          Lihat Katalog Produk →
        </Link>
      </div>

      {/* ABOUT SECTION */}
      <div className="max-w-4xl mx-auto text-center py-20 px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tentang Kami</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Kami adalah perusahaan yang bergerak di bidang pengadaan barang
          berbasis kebutuhan institusi pendidikan. Dengan pengalaman
          bertahun-tahun, kami memahami pentingnya menyediakan produk
          berkualitas dengan proses pemesanan yang terstruktur, mudah, dan
          transparan.
        </p>
      </div>
      <Footer />
    </div>
  );
}

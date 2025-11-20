// src/pages/Home.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductCatalog from "../components/ProductCatalog";
import { products } from "../data/products";
import Footer from "../components/Footer";
import { Wallet } from "lucide-react";
import {
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/solid";

export default function Home() {
  const [category, setCategory] = useState("Semua");

  // === LOGIKA FILTER (Sama seperti di OrderPage) ===
  const filteredProducts = useMemo(() => {
    if (category === "Semua") {
      return products;
    }
    return products.filter((product) => product.category === category);
  }, [category]);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <header className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Pengadaan kebutuhan untuk Sekolah & Instansi
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl">
              TaHUtech menyediakan layanan pengadaan Barang dan Jasa untuk
              Komputer, Elektronik, Furniture dan perlengkapan kantor/sekolah
              dengan proses profesional, transparan, dan dokumentasi lengkap
              (nota PDF otomatis)
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/pemesanan"
                className="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow"
              >
                Mulai Pemesanan
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                Garansi & Keaslian
              </span>
              <span className="inline-flex items-center gap-2">
                <DocumentCheckIcon className="h-5 w-5 text-blue-600" />
                Nota & Dokumen Resmi
              </span>
              <span className="inline-flex items-center gap-2">
                <LifebuoyIcon className="h-5 w-5 text-blue-600" />
                Konsultasi Kebutuhan Gratis
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src="/img/bg2.jpeg"
              alt="Ilustrasi"
              className="w-full max-w-md rounded-xl shadow-xl"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 70%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 70%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <ShieldCheckIcon className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Amanah</h3>
            <p className="text-gray-600">
              Produk resmi, Garansi After Sell, dan Tanggung Jawab
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <ClockIcon className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tepat Waktu</h3>
            <p className="text-gray-600">
              Pengiriman terjadwal untuk kebutuhan semester dan event
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <Wallet className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Harga Institusi</h3>
            <p className="text-gray-600">
              Penawaran kompetitif khusus lembaga dengan
              <span className="font-bold text-red-600"> diskon 10% - 15%</span>.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS KATALOG */}
      <section className="max-w-7xl mx-auto px-6 py-12 bg-white rounded-3xl shadow-sm my-8 border border-gray-100">
        {/* HEADER KATALOG & TOMBOL FILTER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Katalog Produk</h2>
            <p className="text-gray-500 mt-1">
              Telusuri semua kebutuhan operasional Anda.
            </p>
          </div>

          {/* TOMBOL KATEGORI (Pills) */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-full self-start md:self-auto">
            {["Semua", "Elektronik", "Furnitur", "Komputer"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* RENDER KATALOG */}
        {/* Kita set showButton={false} agar tombol "+ Tambah" HILANG */}
        <ProductCatalog products={filteredProducts} showButton={false} />

        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            Sudah menemukan barang yang dicari?
          </p>
          <Link
            to="/pemesanan"
            className="inline-block border-2 border-blue-600 text-blue-700 font-bold py-2 px-6 rounded-lg hover:bg-blue-50 transition"
          >
            Lanjut ke Pemesanan &rarr;
          </Link>
        </div>
      </section>

      {/* ORDER FLOW */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold text-center mb-8">
            Alur Pemesanan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">1</div>
              <h4 className="font-semibold mb-2">Isi Data</h4>
              <p className="text-gray-600">
                Masukkan data sekolah atau instansi dan anggaran.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">2</div>
              <h4 className="font-semibold mb-2">Pilih Produk</h4>
              <p className="text-gray-600">
                Pilih katalog produk dan jumlah yang dibutuhkan.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">3</div>
              <h4 className="font-semibold mb-2">Terima Nota</h4>
              <p className="text-gray-600">
                Pesanan Anda akan diproses dan nota PDF akan dikirimkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPONSORSHIP */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-extrabold text-center mb-4">
          Sponsorship
        </h3>

        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Didukung oleh brand-brand resmi yang menjadi mitra pengadaan kami.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
          {[
            { src: "/img/epson.jpg", name: "Epson" },
            { src: "/img/asus.jpg", name: "Asus" },
            { src: "/img/lenovo.jpg", name: "Lenovo" },
            { src: "/img/hp.jpg", name: "HP" },
            { src: "/img/maspion.jpg", name: "Maspion" },
            { src: "/img/daikin.jpg", name: "Daikin" },
            { src: "/img/rog.jpg", name: "ROG" },
            { src: "/img/tuf.jpg", name: "TUF" },
            { src: "/img/gree.png", name: "Gree" },
          ].map((brand, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center 
                 hover:shadow-xl hover:scale-105 transition duration-300 cursor-pointer border"
            >
              <img
                src={brand.src}
                alt={brand.name}
                className="w-28 object-contain"
              />
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERSHIP */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-extrabold text-center mb-4">
          Partnership
        </h3>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Bekerja sama dengan berbagai toko, vendor, dan supplier terpercaya.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
          {[
            { src: "/img/patnership/bagoestoko1.jpeg", name: "Bagoestoko" },
            { src: "/img/patnership/barata1.jpeg", name: "Barata" },
            { src: "/img/patnership/cvbbs1.jpeg", name: "CV BBS" },
            { src: "/img/patnership/mitraamanah1.jpeg", name: "Mitra Amanah" },
            { src: "/img/patnership/shoes.png", name: "Shoes" },
          ].map((brand, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center 
                 hover:shadow-xl hover:scale-105 transition duration-300 cursor-pointer border"
            >
              <img
                src={brand.src}
                alt={brand.name}
                className="w-28 object-contain"
              />
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

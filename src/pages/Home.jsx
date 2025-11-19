// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import {
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/solid";
const PRODUCTS_SAMPLE = [
  {
    id: 1,
    nama: "Laptop Asus ROG Strix G15",
    spesifikasi: "Intel i5, RAM 8GB, SSD 512GB",
    price: 12000000,
    img: new URL("../assets/products/laptop-asus.jpg", import.meta.url).href,
  },
  {
    id: 2,
    nama: "Printer Epson L3110",
    spesifikasi: "Print/Scan/Copy, Inkjet",
    price: 2500000,
    img: new URL("../assets/products/printer.jpg", import.meta.url).href,
  },
  {
    id: 3,
    nama: "Proyektor Epson EB-X05",
    spesifikasi: "3300 Lumens, XGA",
    price: 6200000,
    img: new URL("../assets/products/proyektor.jpg", import.meta.url).href,
  },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("Semua");

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
              src="/img/bg.jpg"
              alt="Ilustrasi pengadaan"
              className="w-full max-w-md rounded-xl shadow-xl"
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
            <CurrencyDollarIcon className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Harga Institusi</h3>
            <p className="text-gray-600">
              Penawaran kompetitif khusus lembaga dengan
              <span className="font-bold text-red-600"> diskon 10% - 15%</span>.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Produk Unggulan
            </h2>
            <p className="text-gray-600">
              Beberapa produk populer untuk kebutuhan sekolah & kantor.
            </p>
          </div>
          <Link to="/pemesanan" className="text-blue-700 hover:underline">
            Lihat Semua Produk →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {PRODUCTS_SAMPLE.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={() => {
                /* optional */
              }}
            />
          ))}
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
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-center mb-8">Sponsorship</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-80">
          <img
            src="/img/epson.jpg"
            alt="Epson"
            className="w-32 mx-auto grayscale hover:grayscale-0 transition"
          />
          <img
            src="/img/asus.jpg"
            alt="Asus"
            className="w-32 mx-auto grayscale hover:grayscale-0 transition"
          />
          <img
            src="/img/lenovo.jpg"
            alt="Lenovo"
            className="w-32 mx-auto grayscale hover:grayscale-0 transition"
          />
          <img
            src="/img/hp.jpg"
            alt="HP"
            className="w-32 mx-auto grayscale hover:grayscale-0 transition"
          />
        </div>
      </section>

      <section className="border-t border-gray-200"></section>
      <h3 className="text-2xl font-bold text-center my-8">Partnership</h3>

      <div className="max-w-7xl mx-auto px-6 py-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-80">
          <img
            src="/img/patnership/bagoestoko.png"
            alt="Bagoestoko"
            className="w-32 mx-auto grayscale hover:grayscale-0 transition"
          />
          <img
            src="/img/patnership/barata.png"
            alt="Barata"
            className="w-32 mx-auto grayscale hover:grayscale-0 transition"
          />
          <img
            src="/img/patnership/cvbbs.png"
            alt="CV BBS"
            className="w-32 mx-auto grayscale hover:grayscale-0 transition"
          />
          <img
            src="/img/patnership/mitraamanah.png"
            alt="Mitra Amanah"
            className="w-32 mx-auto grayscale hover:grayscale-0 transition"
          />
        </div>
        <img
          src="/img/patnership/shoes.png"
          alt="Sinergi"
          className="w-32 mx-auto mt-8 grayscale hover:grayscale-0 transition"
        />
        <img
          src="/img/patnership/TaHU.png"
          alt="Surya"
          className="w-32 mx-auto mt-8 grayscale hover:grayscale-0 transition"
        />
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

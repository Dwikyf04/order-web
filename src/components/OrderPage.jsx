// src/components/OrderPage.jsx

import React, { useState, useMemo } from "react";
import SchoolForm from "./SchoolForm";
import ProductCatalog from "./ProductCatalog";
import OrderSummary from "./OrderSummary";
// Hapus import Navbar, karena Navbar sekarang ada di App.jsx
// import Navbar from "./Navbar";
import generatePDF from "../utils/generatePDF";
import { products } from "../data/products.js";

// PENTING! Ubah nama fungsi dari 'App' menjadi 'OrderPage'
export default function OrderPage() {
  // === STATE MANAGEMENT ===
  const [schoolData, setSchoolData] = useState(null);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);

  // === STATE BARU UNTUK FILTER ===
  const [category, setCategory] = useState("Semua"); // 2. State untuk melacak kategori

  // === FUNGSI LOGIKA ===
  // ... (Semua fungsi Anda: handleSchoolSubmit, handleProductAdd, dll. tidak berubah) ...
  function handleSchoolSubmit(data) {
    setSchoolData(data);
    setStep(2);
  }

  function handleProductAdd(productToAdd) {
    const existingProduct = cart.find((item) => item.id === productToAdd.id);
    if (existingProduct) {
      alert("Produk sudah ada di keranjang.");
    } else {
      setCart([...cart, productToAdd]);
    }
  }

  function handleProductRemove(productIdToRemove) {
    const newCart = cart.filter((item) => item.id !== productIdToRemove);
    setCart(newCart);
  }

  const filteredProducts = useMemo(() => {
    if (category === "Semua") {
      return products;
    }
    return products.filter((product) => product.category === category);
  }, [category]);

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price, 0);
  }, [cart]);

  function handleCheckout() {
    if (!schoolData) {
      alert("Data sekolah belum diisi.");
      setStep(1);
      return;
    }
    if (cart.length === 0) {
      alert("Keranjang Anda masih kosong.");
      return;
    }
    try {
      generatePDF(schoolData, cart, totalPrice);
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
    }
  }

  // === RENDER ===
  return (
    <>
      {/* Hapus <Navbar /> dari sini */}

      {/* Tambahkan wrapper container 'max-w-7xl' di sini */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* === KOLOM KIRI === */}
        <div className="lg:col-span-2 space-y-6">
          {/* --- LANGKAH 1 --- */}
          <div className="bg-white shadow-lg p-6 rounded-xl border">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span
                className={`flex items-center justify-center w-7 h-7 mr-3 rounded-full ${
                  step === 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                1
              </span>
              Data Sekolah
            </h2>
            {step === 1 && <SchoolForm onSubmit={handleSchoolSubmit} />}
            {step > 1 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p>
                  <strong>Nama Sekolah:</strong> {schoolData.nama}
                </p>
                <p>
                  <strong>Kontak:</strong> {schoolData.telepon}
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-600 text-sm mt-2 hover:underline"
                >
                  Ubah Data
                </button>
              </div>
            )}
          </div>

          {/* --- LANGKAH 2 --- */}
          <div
            className={`bg-white shadow-lg p-6 rounded-xl border ${
              step < 2 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <span
                  className={`flex items-center justify-center w-7 h-7 mr-3 rounded-full ${
                    step === 2 ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  2
                </span>
                Katalog Produk
              </h2>

              {/* === TOMBOL FILTER BARU === */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setCategory("Semua")}
                  className={`text-sm px-3 py-1 rounded-full ${
                    category === "Semua"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setCategory("Elektronik")}
                  className={`text-sm px-3 py-1 rounded-full ${
                    category === "Elektronik"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Elektronik
                </button>
                <button
                  onClick={() => setCategory("Furnitur")}
                  className={`text-sm px-3 py-1 rounded-full ${
                    category === "Furnitur"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Furnitur
                </button>
              </div>
            </div>

            {step === 2 && (
              <ProductCatalog
                products={filteredProducts}
                onProductAdd={handleProductAdd}
              />
            )}
            {step < 2 && (
              <p className="text-gray-500">
                Selesaikan Langkah 1 untuk memilih produk.
              </p>
            )}
          </div>
        </div>

        {/* === KOLOM KANAN (Sidebar) === */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
          <OrderSummary
            cart={cart}
            totalPrice={totalPrice}
            onCheckout={handleCheckout}
            onProductRemove={handleProductRemove}
          />

          <div className="bg-white shadow-lg p-6 rounded-xl border">
            <h2 className="text-xl font-bold mb-4">Butuh Bantuan?</h2>
            <p className="text-gray-600">
              Kamu bisa hubungi admin kami jika ada kendala dalam pemesanan.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

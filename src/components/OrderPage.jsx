import React, { useState, useMemo } from "react";
import SchoolForm from "./SchoolForm";
import toast from "react-hot-toast";
import ProductCatalog from "./ProductCatalog";
import OrderSummary from "./OrderSummary";
import generatePDF from "../utils/generatePDF";
import { products } from "../data/products.js";

export default function OrderPage() {
  // === STATE MANAGEMENT ===
  const [schoolData, setSchoolData] = useState(null);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("Semua");

  // === FUNGSI LOGIKA ===

  function handleSchoolSubmit(data) {
    setSchoolData(data);
    setStep(2);
  }

  // 1. PERBAIKAN: Default quantity jadi 1 (bukan 0)
  function handleProductAdd(productToAdd, quantity = 1) {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.id === productToAdd.id
      );

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === productToAdd.id
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      } else {
        // Pastikan qty masuk ke state
        return [...prevCart, { ...productToAdd, qty: quantity }];
      }
    });

    toast.success(
      `${quantity} ${productToAdd.satuan || "item"} masuk keranjang`
    );
  }

  // 2. PERBAIKAN: Fungsi handleQtyChange ditambahkan kembali
  function handleQtyChange(productId, newQty) {
    if (newQty < 1) return; // Cegah minus
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, qty: newQty } : item
      )
    );
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

  // 3. PERBAIKAN UTAMA: Total harga dikali quantity
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  }, [cart]);

  // === FUNGSI CHECKOUT ===
  function handleCheckout() {
    if (!schoolData) {
      toast.error("Data sekolah belum diisi.");
      setStep(1);
      return;
    }
    if (cart.length === 0) {
      toast.error("Keranjang Anda masih kosong.");
      return;
    }

    try {
      generatePDF(schoolData, cart, totalPrice);
      toast.success("Pemesanan berhasil! Nota PDF Anda telah di-download.");

      setSchoolData(null);
      setCart([]);
      setStep(1);
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      toast.error("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
    }
  }

  // === RENDER ===
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* === KOLOM KIRI === */}
      <div className="lg:col-span-2 space-y-6">
        {/* --- LANGKAH 1: DATA SEKOLAH --- */}
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

        {/* --- LANGKAH 2: KATALOG --- */}
        <div
          className={`bg-white shadow-lg p-6 rounded-xl border ${
            step < 2 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
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

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {["Semua", "Elektronik", "Komputer", "Furnitur"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-sm px-3 py-1 rounded-full transition ${
                    category === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
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
        {/* 4. PERBAIKAN: Pass prop onQtyChange ke OrderSummary */}
        <OrderSummary
          cart={cart}
          totalPrice={totalPrice}
          onCheckout={handleCheckout}
          onProductRemove={handleProductRemove}
          onQtyChange={handleQtyChange}
        />

        <div className="bg-white shadow-lg p-6 rounded-xl border">
          <h2 className="text-xl font-bold mb-4">Butuh Bantuan?</h2>
          <p className="text-gray-600">
            Kamu bisa hubungi admin kami jika ada kendala dalam pemesanan.
          </p>
        </div>
      </div>
    </div>
  );
}

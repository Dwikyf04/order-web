// src/components/OrderPage.jsx

import React, { useState, useMemo } from "react";
import SchoolForm from "./SchoolForm";
import toast from "react-hot-toast";
import ProductCatalog from "./ProductCatalog";
import OrderSummary from "./OrderSummary";
import generatePDF from "../utils/generatePDF";
import { products } from "../data/products.js";
import { supabase } from "../lib/supabaseClient"; // Pastikan file ini sudah ada

export default function OrderPage() {
  // === STATE MANAGEMENT ===
  const [schoolData, setSchoolData] = useState(null);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("Semua");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading saat checkout

  // === FUNGSI LOGIKA ===

  function handleSchoolSubmit(data) {
    setSchoolData(data);
    setStep(2);
  }

  // LOGIKA TAMBAH KE KERANJANG
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
        return [...prevCart, { ...productToAdd, qty: quantity }];
      }
    });

    toast.success(
      `${quantity} ${productToAdd.satuan || "item"} masuk keranjang`
    );
  }

  // LOGIKA UBAH QTY
  function handleQtyChange(productId, newQty) {
    if (newQty < 1) return;
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

  // TOTAL HARGA
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + item.price * item.qty;
    }, 0);
  }, [cart]);

  // === FUNGSI CHECKOUT (DENGAN SUPABASE) ===
  async function handleCheckout() {
    // 1. Validasi
    if (!schoolData) {
      toast.error("Data sekolah belum diisi.");
      setStep(1);
      return;
    }
    if (cart.length === 0) {
      toast.error("Keranjang Anda masih kosong.");
      return;
    }

    // 2. Set Loading
    setIsLoading(true);
    const toastId = toast.loading("Sedang memproses pesanan...");

    try {
      // 3. SIMPAN KE DATABASE SUPABASE
      // Pastikan tabel 'orders' sudah dibuat di Supabase dengan kolom:
      // school_name (text), customer_name (text), items (json), total_price (int8)
      const { error } = await supabase.from("orders").insert([
        {
          school_name: schoolData.nama,
          customer_name: "Admin Sekolah", // Atau ambil dari form jika ada field nama PJ
          items: cart, // Simpan seluruh object cart
          total_price: totalPrice,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // 4. Jika sukses simpan DB, baru buat PDF
      generatePDF(schoolData, cart, totalPrice);

      // 5. Sukses
      toast.success("Pesanan Berhasil! Data tersimpan & PDF diunduh.", {
        id: toastId,
      });

      // 6. Reset State
      setSchoolData(null);
      setCart([]);
      setStep(1);
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Gagal menyimpan pesanan. Cek koneksi internet.", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // === RENDER ===
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* === KOLOM KIRI (Main Content) === */}
      <div className="lg:col-span-2 space-y-6">
        {/* STEP 1: DATA SEKOLAH */}
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
            <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <p>
                  <strong>Nama:</strong> {schoolData.nama}
                </p>
                <p>
                  <strong>Kontak:</strong> {schoolData.telepon}
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 text-sm hover:underline"
              >
                Ubah
              </button>
            </div>
          )}
        </div>

        {/* STEP 2: KATALOG PRODUK */}
        <div
          className={`bg-white shadow-lg p-6 rounded-xl border ${
            step < 2 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
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
            <div className="flex flex-wrap gap-2">
              {["Semua", "Elektronik", "Komputer", "Furnitur"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-sm px-3 py-1 rounded-full transition ${
                    category === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
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
              showButton={true}
            />
          )}
          {step < 2 && (
            <p className="text-gray-500 text-center italic">
              Selesaikan pengisian data sekolah terlebih dahulu.
            </p>
          )}
        </div>
      </div>

      {/* === KOLOM KANAN (Sidebar Ringkasan) === */}
      <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
        <OrderSummary
          cart={cart}
          totalPrice={totalPrice}
          onCheckout={handleCheckout}
          onProductRemove={handleProductRemove}
          onQtyChange={handleQtyChange}
        />

        {/* Indikator Loading (Opsional, tapi bagus untuk UX) */}
        {isLoading && (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-center text-sm animate-pulse border border-blue-200">
            Sedang memproses pesanan ke server...
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
          <p className="font-semibold mb-1">Info:</p>
          <p>
            Harga yang tertera adalah harga estimasi. Nota resmi akan digenerate
            otomatis setelah checkout.
          </p>
        </div>
      </div>
    </div>
  );
}

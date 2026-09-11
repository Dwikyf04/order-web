// src/components/OrderPage.jsx

import React, { useState, useMemo } from "react";
import SchoolForm from "./SchoolForm";
import toast from "react-hot-toast";
import ProductCatalog from "./ProductCatalog";
import OrderSummary from "./OrderSummary";
import { createOrder } from "../application/orders/createOrder";
import { useCatalog } from "../application/catalog/useCatalog";
import { useSiteSettings } from "../application/content/SiteSettingsContext";

export default function OrderPage() {
  // === STATE MANAGEMENT ===
  const [schoolData, setSchoolData] = useState(null);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("Semua");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading saat checkout
  const siteConfig = useSiteSettings();
  const {
    products,
    categories,
    loading: catalogLoading,
    error: catalogError,
  } = useCatalog({ category });

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
      // Backend/database menghitung ulang harga dari katalog resmi.
      const orderItems = cart.map((item) => ({
        productId: typeof item.catalogId === "string" ? item.catalogId : null,
        legacyProductId: String(item.catalogId ?? item.id),
        variantId: item.variantId || null,
        variantKey: item.variantKey || null,
        quantity: item.qty,
      }));

      const order = await createOrder({
        school: schoolData,
        customerName: schoolData.customerName || null,
        items: orderItems,
      });

      // 4. Jika sukses simpan DB, baru buat PDF
      const { default: generatePDF } = await import("../utils/generatePDF");
      generatePDF(schoolData, cart, order.total_price, order.order_code, siteConfig);

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
    <div className="w-full max-w-7xl mx-auto px-3 py-4 sm:px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] gap-4 lg:gap-8">
      {/* === KOLOM KIRI (Main Content) === */}
      <div className="lg:col-span-2 space-y-6">
        {/* STEP 1: DATA SEKOLAH */}
        <div className="bg-white shadow-lg p-4 sm:p-6 rounded-xl border">
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
                  <strong>Nama:</strong> {schoolData.name}
                </p>
                <p>
                  <strong>Kontak:</strong> {schoolData.phone}
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
          className={`bg-white shadow-lg p-4 sm:p-6 rounded-xl border ${
            step < 2 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
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
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full scrollbar-thin">
              {["Semua", ...categories.map((item) => item.slug)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                    className={`text-sm px-3 py-1 rounded-full transition whitespace-nowrap shrink-0 ${
                    category === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  {cat === "Semua"
                    ? "Semua"
                    : categories.find((item) => item.slug === cat)?.name || cat}
                </button>
              ))}
            </div>
          </div>

          {step === 2 && catalogLoading && (
            <p className="text-center text-gray-500 py-10">Memuat katalog...</p>
          )}
          {step === 2 && catalogError && (
            <p className="text-center text-red-600 py-10">
              Katalog belum dapat dimuat. Silakan coba lagi.
            </p>
          )}
          {step === 2 && !catalogLoading && !catalogError && (
            <ProductCatalog
              products={products}
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
      <div className="lg:col-span-1 space-y-6 xl:sticky xl:top-8 xl:self-start">
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

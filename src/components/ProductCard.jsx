// src/components/ProductCard.jsx
import React, { useState } from "react";

export default function ProductCard({ product, onAddToCart, action }) {
  // State untuk Logic Toko
  const [qty, setQty] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // FITUR BARU: State untuk Modal Gambar
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Cek apakah produk memiliki varian?
  const hasVariants = product.variants && product.variants.length > 0;

  // Tentukan harga yang ditampilkan (Varian vs Default)
  const currentPrice = hasVariants
    ? product.variants[selectedVariantIndex].price
    : product.price;

  const handleAddClick = () => {
    if (onAddToCart && qty > 0) {
      let itemToSend = product;

      // Jika ada varian, modifikasi item yang dikirim
      if (hasVariants) {
        const variant = product.variants[selectedVariantIndex];
        itemToSend = {
          ...product,
          id: `${product.id}-${selectedVariantIndex}`, // ID Unik
          nama: `${product.nama} (${variant.name})`, // Nama Lengkap
          price: variant.price, // Harga Varian
        };
      }

      onAddToCart(itemToSend, qty);
      setQty(0); // Reset input kembali ke 0
    }
  };

  return (
    <>
      {/* === KARTU PRODUK UTAMA === */}
      <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition flex flex-col h-full border border-gray-100">
        {/* GAMBAR PRODUK (SEKARANG BISA DIKLIK) */}
        <div
          className="w-full h-44 overflow-hidden rounded-lg mb-3 bg-gray-100 group relative cursor-pointer"
          onClick={() => setIsImageOpen(true)} // Buka Modal saat diklik
          title="Klik untuk memperbesar gambar"
        >
          <img
            src={
              hasVariants && product.variants[selectedVariantIndex].img
                ? product.variants[selectedVariantIndex].img
                : product.img
            }
            alt={product.nama}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />

          {/* Overlay ikon mata (Opsional, agar user tahu bisa diklik) */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-bold bg-black bg-opacity-50 px-2 py-1 rounded-full pointer-events-none">
              🔍 Lihat Detail
            </span>
          </div>
        </div>

        {/* INFO PRODUK */}
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-lg leading-snug">
            {product.nama}
          </h4>
          <p className="text-gray-500 text-xs mt-1 mb-3">
            {product.spesifikasi}
          </p>

          {/* DROPDOWN VARIAN */}
          {hasVariants && (
            <div className="mb-3">
              <label className="text-xs text-gray-500 font-bold mb-1 block">
                Pilih Tipe:
              </label>
              <select
                className="w-full border border-gray-300 text-sm rounded-md p-1 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                value={selectedVariantIndex}
                onChange={(e) =>
                  setSelectedVariantIndex(Number(e.target.value))
                }
              >
                {product.variants.map((variant, index) => (
                  <option key={index} value={index}>
                    {variant.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* HARGA & AKSI */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="text-blue-700 font-bold text-lg mb-3">
            Rp {currentPrice.toLocaleString("id-ID")}
          </div>

          {action && <div>{action}</div>}

          {onAddToCart && (
            <div className="flex gap-2 h-10">
              <input
                type="number"
                min="0"
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-16 border border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <button
                onClick={handleAddClick}
                disabled={qty === 0}
                className={`flex-1 rounded-lg font-medium text-sm transition shadow-md active:scale-95 ${
                  qty === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800 text-white"
                }`}
              >
                + Tambah
              </button>
            </div>
          )}
        </div>
      </div>

      {/* === MODAL POPUP GAMBAR (LIGHTBOX) === */}
      {isImageOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 animate-fadeIn"
          onClick={() => setIsImageOpen(false)} // Tutup saat klik area hitam
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Tombol Close */}
            <button
              className="absolute -top-10 right-0 md:-right-10 text-white hover:text-gray-300 font-bold text-2xl"
              onClick={() => setIsImageOpen(false)}
            >
              ✕ Tutup
            </button>

            {/* Gambar Besar */}
            <img
              src={
                hasVariants && product.variants[selectedVariantIndex].img
                  ? product.variants[selectedVariantIndex].img
                  : product.img
              }
              alt={product.nama}
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Info di bawah gambar */}
            <div className="text-center mt-4 text-white">
              <h3 className="text-xl font-bold">{product.nama}</h3>
              <p className="text-gray-300 text-sm">{product.spesifikasi}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// src/components/ProductCard.jsx
import React, { useState } from "react";

export default function ProductCard({ product, onAddToCart, action }) {
  const [qty, setQty] = useState(1);

  const handleAddClick = () => {
    if (onAddToCart) {
      onAddToCart(product, qty); // Kirim data produk DAN jumlahnya
      setQty(1); // Reset input jadi 1 setelah ditambah
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition flex flex-col h-full border border-gray-100">
      {/* 1. GAMBAR */}
      <div className="w-full h-44 overflow-hidden rounded-lg mb-3 bg-gray-100 group relative">
        <img
          src={product.img}
          alt={product.nama}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* 2. INFO PRODUK */}
      <div className="flex-1">
        <h4 className="font-bold text-gray-800 text-lg leading-snug">
          {product.nama}
        </h4>
        <p className="text-gray-500 text-xs mt-1 mb-3">{product.spesifikasi}</p>
      </div>

      {/* 3. HARGA & AKSI (Footer Card) */}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <div className="text-blue-700 font-bold text-lg mb-3">
          Rp {product.price.toLocaleString("id-ID")}
        </div>

        {/* KONDISI 1: Jika ini halaman Home (ada props 'action'), tampilkan Link */}
        {action && <div>{action}</div>}

        {/* KONDISI 2: Jika ini halaman Order (ada props 'onAddToCart'), tampilkan Input & Tombol */}
        {onAddToCart && (
          <div className="flex gap-2 h-10">
            {/* Input Angka */}
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 border border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* Tombol Tambah */}
            <button
              onClick={handleAddClick}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium text-sm transition shadow-md active:scale-95"
            >
              + Tambah
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

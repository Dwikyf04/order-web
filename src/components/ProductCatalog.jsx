// src/components/ProductCatalog.jsx
import React from "react";

// 1. Terima 'products' (yang sudah difilter) sebagai prop
export default function ProductCatalog({ products, onProductAdd }) {
  return (
    <div>
      {/* 2. Tambahkan pesan jika filter tidak menemukan apa-apa */}
      {products.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          Tidak ada produk di kategori ini.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 3. Map akan menggunakan prop 'products' */}
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded-lg shadow-sm">
            {/* <img src={p.img} ... /> */}

            <b>{p.nama}</b>
            <p className="text-sm text-gray-600">{p.spesifikasi}</p>
            <p className="text-lg font-bold text-blue-700 mt-2">
              Rp {p.price.toLocaleString()}
            </p>

            <button
              className="mt-3 bg-blue-700 hover:bg-blue-800 text-white w-full py-2 rounded-lg"
              onClick={() => onProductAdd(p)}
            >
              + Tambah
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// src/components/ProductCard.jsx
import React from "react";

export default function ProductCard({ product, onSelect }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
      <div className="w-full h-44 overflow-hidden rounded-lg mb-3 bg-gray-100">
        <img
          src={product.img}
          alt={product.nama}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-lg">{product.nama}</h4>
        <p className="text-gray-500 text-sm mt-1">{product.spesifikasi}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-blue-700 font-semibold">
          Rp {product.price.toLocaleString()}
        </div>
        {/* <button
          onClick={() => onSelect && onSelect(product)}
          className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md"
        >
          Pilih
        </button> */}
      </div>
    </div>
  );
}

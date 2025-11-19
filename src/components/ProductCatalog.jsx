// src/components/ProductCatalog.jsx
import React from "react";
import ProductCard from "./ProductCard"; // 1. Import komponen ProductCard

export default function ProductCatalog({
  products,
  onProductAdd,
  showButton = true,
}) {
  return (
    <div>
      {/* Pesan jika produk kosong */}
      {products.length === 0 && (
        <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-lg border border-dashed">
          Tidak ada produk di kategori ini.
        </p>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={showButton ? onProductAdd : null}
          />
        ))}
      </div>
    </div>
  );
}

import React from "react";

// 1. Menerima 'products', 'onProductAdd', dan 'showButton' (Default: true)
export default function ProductCatalog({
  products,
  onProductAdd,
  showButton = true,
}) {
  return (
    <div>
      {/* 2. Pesan jika tidak ada produk */}
      {products.length === 0 && (
        <p className="text-gray-500 text-center py-4 border-dashed border-2 rounded-lg">
          Tidak ada produk di kategori ini.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 3. Map produk */}
        {products.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded-lg shadow-sm bg-white flex flex-col h-full"
          >
            <img
              src={p.img}
              alt={p.nama}
              className="mb-3 rounded-lg w-full h-40 object-cover"
            />

            <b className="text-lg">{p.nama}</b>
            <p className="text-sm text-gray-600 mb-2">{p.spesifikasi}</p>

            {/* Spacer agar harga & tombol selalu di bawah (rata) */}
            <div className="mt-auto">
              <p className="text-lg font-bold text-blue-700 mt-2">
                Rp {p.price.toLocaleString("id-ID")}
              </p>

              {/* 4. LOGIKA REVISI: Tombol hanya muncul jika showButton bernilai TRUE */}
              {showButton && (
                <button
                  className="mt-3 bg-blue-700 hover:bg-blue-800 text-white w-full py-2 rounded-lg font-semibold transition"
                  onClick={() => onProductAdd(p)}
                >
                  + Tambah
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

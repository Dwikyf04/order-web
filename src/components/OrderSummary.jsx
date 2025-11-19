// src/components/OrderSummary.jsx
import React from "react";

export default function OrderSummary({
  cart,
  totalPrice,
  onCheckout,
  onProductRemove,
  onQtyChange, // <--- Pastikan props ini diterima dari OrderPage
}) {
  // Hitung Total Jumlah Barang (Unit)
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Ringkasan Pesanan
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
          <p className="text-gray-500">Keranjang kosong.</p>
          <p className="text-xs text-gray-400 mt-1">Pilih produk di katalog.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-100"
            >
              {/* BARIS 1: Nama Produk & Tombol Hapus */}
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-gray-800 w-10/12 leading-tight">
                  {item.nama}
                </span>
                <button
                  onClick={() => onProductRemove(item.id)}
                  className="text-red-400 hover:text-red-600 font-bold px-1"
                  title="Hapus produk ini"
                >
                  &times;
                </button>
              </div>

              {/* BARIS 2: Harga Satuan & Kontrol Quantity */}
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500">
                  @ Rp {item.price.toLocaleString("id-ID")}
                </div>

                {/* === FITUR QUANTITY (YANG KAMU CARI) === */}
                <div className="flex items-center bg-white border border-gray-300 rounded-md h-8">
                  <button
                    className="px-2 text-gray-600 hover:bg-gray-100 h-full rounded-l-md font-bold"
                    onClick={() => onQtyChange(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >
                    -
                  </button>

                  {/* Menampilkan Jumlah Produk */}
                  <input
                    type="text"
                    readOnly
                    value={item.qty}
                    className="w-8 text-center text-sm font-bold focus:outline-none text-gray-800"
                  />

                  <button
                    className="px-2 text-blue-600 hover:bg-blue-50 h-full rounded-r-md font-bold"
                    onClick={() => onQtyChange(item.id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* BARIS 3: Subtotal per Item */}
              <div className="text-right text-xs font-bold text-blue-700 mt-2 pt-2 border-t border-gray-200">
                Subtotal: Rp {(item.price * item.qty).toLocaleString("id-ID")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === GRAND TOTAL === */}
      <div className="border-t-2 border-dashed border-gray-200 pt-4 mt-4">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
          <span>Total Barang:</span>
          {/* Menampilkan total unit (misal: 15 Unit) */}
          <span className="font-bold text-gray-800">{totalItems} Unit</span>
        </div>

        <div className="flex justify-between items-center text-lg font-extrabold text-gray-900 mt-2">
          <span>Total Bayar:</span>
          <span className="text-blue-700">
            Rp {totalPrice.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={cart.length === 0}
        className={`w-full mt-6 py-3 rounded-lg font-bold text-white shadow-md transition transform active:scale-95 ${
          cart.length === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Pesan Sekarang
      </button>
    </div>
  );
}

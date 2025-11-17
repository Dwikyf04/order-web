// src/components/OrderSummary.jsx
import React from "react";

// 1. Terima 'onProductRemove' sebagai prop
export default function OrderSummary({
  cart,
  totalPrice,
  onCheckout,
  onProductRemove,
}) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-xl border">
      <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Keranjang Anda kosong.</p>
      ) : (
        <div className="space-y-3 mb-4">
          {cart.map((item) => (
            // 2. Ubah div ini menjadi flex agar bisa menampung tombol Hapus
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <span className="text-sm">{item.nama}</span>
                <p className="text-sm font-semibold">
                  Rp {item.price.toLocaleString()}
                </p>
              </div>

              {/* 3. Tombol Hapus BARU */}
              <button
                onClick={() => onProductRemove(item.id)}
                className="text-red-500 hover:text-red-700 font-bold text-lg px-2"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <hr className="my-4" />
      <div className="flex justify-between text-lg font-bold mb-6">
        <span>Total Harga:</span>
        <span>Rp {totalPrice.toLocaleString()}</span>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        disabled={cart.length === 0}
      >
        Pesan Sekarang!
      </button>
    </div>
  );
}

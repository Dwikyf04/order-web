import React from "react";

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold">Detail Order</h2>
            <p className="text-sm text-blue-600">{order.order_code}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 text-2xl" aria-label="Tutup">×</button>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-6">
          <div><dt className="font-semibold">Sekolah</dt><dd>{order.school_name}</dd></div>
          <div><dt className="font-semibold">Pemesan</dt><dd>{order.customer_name || "-"}</dd></div>
          <div><dt className="font-semibold">Alamat</dt><dd>{order.school_address}</dd></div>
          <div><dt className="font-semibold">Kota/Kecamatan</dt><dd>{order.city} / {order.district}</dd></div>
          <div><dt className="font-semibold">Telepon</dt><dd>{order.phone}</dd></div>
          <div><dt className="font-semibold">Anggaran</dt><dd>{order.budget}</dd></div>
        </dl>
        <div className="border-t pt-4 space-y-2">
          {(order.order_items || []).map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-sm">
              <span>{item.quantity}x {item.product_name_snapshot}{item.variant_name_snapshot ? ` (${item.variant_name_snapshot})` : ""}</span>
              <span>Rp {Number(item.subtotal).toLocaleString("id-ID")}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>Rp {Number(order.total_price || 0).toLocaleString("id-ID")}</span>
        </div>
      </div>
    </div>
  );
}

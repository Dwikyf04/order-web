import React from "react";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderTable({
  orders,
  onPaymentChange,
  onDeliveryChange,
  onSelect,
  onDelete,
  deletingOrderId,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4">Tanggal & ID</th>
              <th className="p-4">Sekolah</th>
              <th className="p-4 w-1/3">Detail Barang</th>
              <th className="p-4 text-right">Total Harga</th>
              <th className="p-4 text-center">Pembayaran</th>
              <th className="p-4 text-center">Pengiriman</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-blue-50 transition">
                <td className="p-4 align-top">
                  <button type="button" onClick={() => onSelect(order)} className="text-left">
                    <div className="font-medium text-gray-900">{formatDate(order.created_at)}</div>
                    <div className="text-xs text-blue-600 mt-1">{order.order_code}</div>
                  </button>
                </td>
                <td className="p-4 align-top">
                  <div className="font-bold text-gray-800">{order.school_name || "-"}</div>
                  <div className="text-sm text-gray-500">{order.customer_name || "-"}</div>
                </td>
                <td className="p-4 align-top">
                  <ul className="space-y-1 text-sm text-gray-600">
                    {(order.order_items || []).map((item) => (
                      <li key={item.id}>
                        <span className="font-bold text-gray-800">{item.quantity}x </span>
                        {item.product_name_snapshot}
                        {item.variant_name_snapshot ? ` (${item.variant_name_snapshot})` : ""}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 align-top text-right font-bold text-blue-700">
                  Rp {Number(order.total_price || 0).toLocaleString("id-ID")}
                </td>
                <td className="p-4 align-top text-center">
                  <select
                    value={order.payment_status}
                    onChange={(event) => onPaymentChange(order.id, event.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full border w-28"
                  >
                    <option value="Belum">Belum</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                </td>
                <td className="p-4 align-top text-center">
                  <select
                    value={order.delivery_status}
                    onChange={(event) => onDeliveryChange(order.id, event.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full border w-32"
                  >
                    <option value="Belum Terkirim">Belum Terkirim</option>
                    <option value="Terkirim">Terkirim</option>
                  </select>
                </td>
                <td className="p-4 align-top text-center">
                  <button
                    type="button"
                    onClick={() => onDelete(order)}
                    disabled={deletingOrderId === order.id}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                  >
                    {deletingOrderId === order.id ? "Menghapus..." : "Hapus"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data saat halaman dibuka
  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false }); // Urutkan dari yang terbaru

    if (error) console.error("Error fetch:", error);
    else setOrders(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Kembali ke Home
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <p className="p-8 text-center">Mengambil data...</p>
          ) : orders.length === 0 ? (
            <p className="p-8 text-center text-gray-500">Belum ada pesanan.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Sekolah</th>
                    <th className="p-4">Detail Barang</th>
                    <th className="p-4">Total Harga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      {/* Tanggal */}
                      <td className="p-4 text-sm">
                        {new Date(order.created_at).toLocaleDateString("id-ID")}
                        <br />
                        <span className="text-gray-400 text-xs">
                          {new Date(order.created_at).toLocaleTimeString(
                            "id-ID"
                          )}
                        </span>
                      </td>

                      {/* Nama Sekolah */}
                      <td className="p-4 font-semibold">{order.school_name}</td>

                      {/* Detail Item (Looping JSON) */}
                      <td className="p-4 text-sm">
                        <ul className="list-disc list-inside text-gray-600">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.qty}x {item.nama}
                            </li>
                          ))}
                        </ul>
                      </td>

                      {/* Total Harga */}
                      <td className="p-4 font-bold text-blue-700">
                        Rp {order.total_price.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

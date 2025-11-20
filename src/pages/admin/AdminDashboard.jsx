import React, { useEffect, useState } from "react";
// Pastikan import ini sudah benar (naik 2 level)
import { supabase } from "../../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom"; // Tambah useNavigate

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate(); // Hook untuk pindah halaman

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error("Error fetch:", err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // === FUNGSI LOGOUT ===
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Yakin ingin keluar?");
    if (confirmLogout) {
      await supabase.auth.signOut();
      navigate("/login"); // Kembali ke halaman login
    }
  };

  // Format tanggal aman
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Admin
            </h1>
            <p className="text-gray-500">
              Pantau pesanan masuk secara real-time.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchOrders}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 text-sm font-medium transition"
            >
              Refresh Data
            </button>

            <Link
              to="/"
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 text-sm font-medium transition flex items-center"
            >
              Ke Home
            </Link>

            {/* === TOMBOL LOGOUT (BARU) === */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-bold transition shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message Box */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {errorMsg} <br />
            <small>
              Cek tab "Table Editor" di Supabase, pastikan RLS dimatikan.
            </small>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-12 text-center text-gray-500 animate-pulse">
              Memuat data pesanan...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">Belum ada pesanan masuk.</p>
              <p className="text-sm text-gray-400">
                Data akan muncul di sini setelah user melakukan checkout.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold">Tanggal & ID</th>
                    <th className="p-4 font-semibold">Sekolah</th>
                    <th className="p-4 font-semibold">Detail Barang</th>
                    <th className="p-4 font-semibold text-right">
                      Total Harga
                    </th>
                    <th className="p-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-blue-50 transition">
                      {/* Tanggal */}
                      <td className="p-4 align-top">
                        <div className="font-medium text-gray-900">
                          {formatDate(order.created_at)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          ID: #{order.id}
                        </div>
                      </td>

                      {/* Sekolah */}
                      <td className="p-4 align-top">
                        <div className="font-bold text-gray-800">
                          {order.school_name || order.customer_school || "-"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer_name || "Admin"}
                        </div>
                      </td>

                      {/* Barang */}
                      <td className="p-4 align-top">
                        <ul className="space-y-1 text-sm text-gray-600">
                          {Array.isArray(order.items) ? (
                            order.items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="font-bold text-gray-800 min-w-[20px]">
                                  {item.qty}x
                                </span>
                                <span>{item.nama}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-red-500 italic">
                              Format data salah
                            </li>
                          )}
                        </ul>
                      </td>

                      {/* Harga */}
                      <td className="p-4 align-top text-right font-bold text-blue-700">
                        Rp {(order.total_price || 0).toLocaleString("id-ID")}
                      </td>

                      {/* Status */}
                      <td className="p-4 align-top text-center">
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          {order.status || "Baru"}
                        </span>
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

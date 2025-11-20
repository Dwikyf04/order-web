import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // Import Library Excel

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

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

  // === FUNGSI UPDATE STATUS PEMBAYARAN ===
  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, payment_status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Gagal update status: " + err.message);
    }
  };

  // === FUNGSI UPDATE STATUS PENGIRIMAN ===
  const updateDeliveryStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ delivery_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, delivery_status: newStatus }
            : order
        )
      );
    } catch (err) {
      alert("Gagal update status: " + err.message);
    }
  };

  // === FUNGSI EXPORT KE EXCEL (BARU!) ===
  const handleExportExcel = () => {
    // 1. Siapkan Data yang Rapi untuk Excel
    const dataToExport = orders.map((order) => {
      // Menggabungkan nama barang menjadi satu string agar rapi di sel Excel
      const detailBarang = Array.isArray(order.items)
        ? order.items.map((item) => `${item.qty}x ${item.nama}`).join(", ") // Pemisah antar barang
        : "Data Error";

      return {
        "ID Order": order.id,
        Tanggal: new Date(order.created_at).toLocaleDateString("id-ID"),
        "Nama Sekolah": order.school_name || "-",
        Pemesan: order.customer_name || "-",
        "Detail Barang": detailBarang,
        "Total Harga": order.total_price,
        "Status Pembayaran": order.payment_status || "Belum",
        "Status Pengiriman": order.delivery_status || "Proses",
      };
    });

    // 2. Buat Worksheet (Lembar Kerja)
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // 3. Atur Lebar Kolom (Opsional, biar rapi)
    const columnWidths = [
      { wch: 10 }, // ID
      { wch: 15 }, // Tanggal
      { wch: 25 }, // Sekolah
      { wch: 20 }, // Pemesan
      { wch: 50 }, // Detail Barang (Lebar karena isinya panjang)
      { wch: 15 }, // Harga
      { wch: 15 }, // Bayar
      { wch: 15 }, // Kirim
    ];
    worksheet["!cols"] = columnWidths;

    // 4. Buat Workbook (Buku Kerja)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");

    // 5. Download File
    XLSX.writeFile(
      workbook,
      `Laporan_Order_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Yakin ingin keluar?");
    if (confirmLogout) {
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

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
      <div className="max-w-[90rem] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Admin
            </h1>
            <p className="text-gray-500">
              Pantau pesanan, pembayaran, dan pengiriman.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            <button
              onClick={fetchOrders}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 text-sm font-medium transition"
            >
              Refresh Data
            </button>

            {/* === TOMBOL EXPORT EXCEL (BARU) === */}
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-bold transition shadow-sm flex items-center gap-2"
            >
              <span>📥</span> Export Excel
            </button>

            <Link
              to="/"
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 text-sm font-medium transition flex items-center"
            >
              Ke Home
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-bold transition shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {errorMsg}
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
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold">Tanggal & ID</th>
                    <th className="p-4 font-semibold">Sekolah</th>
                    <th className="p-4 font-semibold w-1/3">Detail Barang</th>
                    <th className="p-4 font-semibold text-right">
                      Total Harga
                    </th>
                    <th className="p-4 font-semibold text-center">
                      Pembayaran
                    </th>
                    <th className="p-4 font-semibold text-center">
                      Pengiriman
                    </th>
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

                      {/* Status Pembayaran */}
                      <td className="p-4 align-top text-center">
                        <select
                          value={order.payment_status || "Belum"}
                          onChange={(e) =>
                            updatePaymentStatus(order.id, e.target.value)
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer transition shadow-sm w-28 ${
                            order.payment_status === "Lunas"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          <option value="Belum">Belum</option>
                          <option value="Lunas">Lunas</option>
                        </select>
                      </td>

                      {/* Status Pengiriman */}
                      <td className="p-4 align-top text-center">
                        <select
                          value={order.delivery_status || "Belum Terkirim"}
                          onChange={(e) =>
                            updateDeliveryStatus(order.id, e.target.value)
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer transition shadow-sm w-32 ${
                            order.delivery_status === "Terkirim"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }`}
                        >
                          <option value="Belum Terkirim">Belum Terkirim</option>
                          <option value="Terkirim">Terkirim</option>
                        </select>
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

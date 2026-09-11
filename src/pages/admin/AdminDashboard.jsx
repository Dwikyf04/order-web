import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Filters from "./Filters";
import OrderTable from "./OrderTable";
import OrderDetailModal from "./OrderDetailModal";
import { exportOrdersToExcel } from "../../application/orders/exportOrders";
import { listOrders, updateOrderStatus } from "../../infrastructure/orders/orderRepository";
import { signOut } from "../../infrastructure/auth/authRepository";

const initialFilters = { search: "", payment: "", delivery: "" };

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const navigate = useNavigate();

  async function fetchOrders() {
    setLoading(true);
    setErrorMessage("");
    try {
      setOrders(await listOrders());
    } catch (error) {
      setErrorMessage(error.message || "Gagal memuat order.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch = !search || [order.order_code, order.school_name, order.customer_name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search));
      const matchesPayment = !filters.payment || order.payment_status === filters.payment;
      const matchesDelivery = !filters.delivery || order.delivery_status === filters.delivery;
      return matchesSearch && matchesPayment && matchesDelivery;
    });
  }, [orders, filters]);

  function changeFilters(next) {
    setFilters((current) => ({ ...current, ...next }));
  }

  async function changeStatus(orderId, field, value) {
    setActionError("");
    try {
      const updated = await updateOrderStatus(orderId, { [field]: value });
      setOrders((current) => current.map((order) => order.id === orderId ? { ...order, ...updated } : order));
      setSelectedOrder((current) => current?.id === orderId ? { ...current, ...updated } : current);
    } catch (error) {
      setActionError(error.message || "Gagal mengubah status order.");
    }
  }

  async function handleExport() {
    try {
      await exportOrdersToExcel(filteredOrders);
    } catch (error) {
      setActionError(error.message || "Gagal mengekspor order.");
    }
  }

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-[90rem] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
            <p className="text-gray-500">Pantau pesanan, pembayaran, dan pengiriman.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            <button type="button" onClick={fetchOrders} className="bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 text-sm font-medium">Refresh Data</button>
            <button type="button" onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-bold">Export Excel</button>
            <Link to="/" className="bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 text-sm font-medium">Ke Home</Link>
            <button type="button" onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-bold">Logout</button>
          </div>
        </div>

        {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errorMessage}</div>}
        {actionError && <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">{actionError}</div>}
        <Filters filters={filters} onChange={changeFilters} onReset={() => setFilters(initialFilters)} />

        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500 animate-pulse">Memuat data pesanan...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500">Tidak ada order yang sesuai filter.</div>
        ) : (
          <OrderTable
            orders={filteredOrders}
            onSelect={setSelectedOrder}
            onPaymentChange={(id, value) => changeStatus(id, "payment_status", value)}
            onDeliveryChange={(id, value) => changeStatus(id, "delivery_status", value)}
          />
        )}
      </div>
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}

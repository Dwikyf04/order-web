import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import OrderPage from "./components/OrderPage";
import LoginPage from "./pages/LoginPage"; // Import Login
import AdminDashboard from "./pages/admin/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute"; // Import Guard

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pemesanan" element={<OrderPage />} />

        {/* Halaman Login (Bisa diakses siapa saja) */}
        <Route path="/login" element={<LoginPage />} />

        {/* --- RUTE YANG DIPROTEKSI --- */}
        {/* Semua rute di dalam sini butuh login */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

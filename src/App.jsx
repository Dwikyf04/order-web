import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home"; // Halaman Home yang kita buat
import OrderPage from "./components/OrderPage"; // Halaman Pemesanan (file di bawah)
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      {/* Navbar sekarang tampil di SEMUA halaman */}
      <Navbar />

      {/* Konten halaman akan berganti di sini 
        Wrapper 'max-w-7xl' sekarang ada di dalam Home.jsx dan OrderPage.jsx
      */}
      <Routes>
        {/* Rute untuk Homepage (URL: /) */}
        <Route path="/" element={<Home />} />

        {/* Rute untuk Halaman Pemesanan (URL: /pemesanan) */}
        <Route path="/pemesanan" element={<OrderPage />} />
      </Routes>
    </div>
  );
}

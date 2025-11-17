import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; // Halaman Home yang kita buat
import OrderPage from "./components/OrderPage"; // Halaman Pemesanan (file di bawah)

export default function App() {
  return (
    <>
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
    </>
  );
}

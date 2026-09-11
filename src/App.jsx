import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import OrderPage from "./components/OrderPage";
import PrivateRoute from "./components/PrivateRoute"; // Import Guard
import { SiteSettingsProvider } from "./application/content/SiteSettingsContext";

const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

export default function App() {
  return (
    <SiteSettingsProvider>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-center" />
        <Navbar />

      <Suspense
        fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Memuat halaman...</div>}
      >
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
        </Suspense>
      </div>
    </SiteSettingsProvider>
  );
}

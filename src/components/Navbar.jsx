// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom"; // 1. Impor Link

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between">
        {/* 2. Ubah ini menjadi Link ke Homepage */}
        <Link to="/" className="text-lg font-semibold">
          Tahutech
        </Link>

        <div className="flex gap-6">
          {/* 3. Ubah ini menjadi Link */}
          <Link to="/" className="hover:text-gray-200">
            Home
          </Link>
          <Link to="/pemesanan" className="hover:text-gray-200">
            Pemesanan
          </Link>
        </div>
      </div>
    </nav>
  );
}

// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO & BRAND */}
        <Link
          to="/"
          className="text-lg font-semibold flex items-center gap-3 hover:opacity-90 transition"
        >
          {/* Logo Palestina */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_Palestine.svg"
            alt="Palestine Flag"
            className="h-8 w-auto rounded-sm shadow-sm"
          />

          {/* Nama Brand */}
          <span>Tahutech</span>
        </Link>

        {/* NAVIGASI */}
        <div className="flex gap-6 items-center text-sm md:text-base">
          <Link to="/" className="hover:text-blue-200 transition">
            Home
          </Link>
          <Link to="/pemesanan" className="hover:text-blue-200 transition">
            Pemesanan
          </Link>
          <Link
            to="/admin"
            className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-50 transition font-medium"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

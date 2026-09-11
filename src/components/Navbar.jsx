// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../application/content/SiteSettingsContext";

export default function Navbar() {
  const siteConfig = useSiteSettings();
  return (
    <nav className="bg-blue-700 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-6 justify-between items-start sm:items-center">
        {/* LOGO & BRAND */}
        <Link
          to="/"
          className="text-lg font-semibold flex items-center gap-3 hover:opacity-90 transition"
        >
          {/* Logo Palestina */}
          <img
            src={siteConfig.logoUrl}
            alt={`${siteConfig.name} logo`}
            className="h-8 w-auto rounded-sm shadow-sm"
          />

          {/* Nama Brand */}
          <span>{siteConfig.name}</span>
        </Link>

        {/* NAVIGASI */}
        <div className="w-full sm:w-auto flex flex-wrap gap-3 sm:gap-6 items-center text-sm md:text-base">
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

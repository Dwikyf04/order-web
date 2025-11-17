import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-semibold text-white">OrderWeb</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Platform pemesanan cepat untuk kebutuhan sekolah Anda.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Navigasi</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/order" className="hover:text-white">
                Pemesanan
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Kontak</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: orderweb-support@gmail.com</li>
            <li>
              WhatsApp:{" "}
              <a
                className="hover:text-white"
                href="https://wa.me/6281234567890"
              >
                +62 812-3456-7890
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} OrderWeb – All Rights Reserved.
      </div>
    </footer>
  );
}

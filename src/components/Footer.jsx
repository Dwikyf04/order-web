import React from "react";
import { useSiteSettings } from "../application/content/SiteSettingsContext";

export default function Footer() {
  const siteConfig = useSiteSettings();
  const whatsappHref = siteConfig.whatsapp
    ? `https://wa.me/${siteConfig.whatsapp}`
    : undefined;

  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-white">{siteConfig.name}</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Platform pemesanan cepat untuk kebutuhan sekolah Anda.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Kontak</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={siteConfig.email ? `mailto:${siteConfig.email}` : undefined} className="hover:text-red-500">
                {siteConfig.email || "Email belum dikonfigurasi"}
              </a>
            </li>
            <li>
              <a href={whatsappHref} className="hover:text-green-600">
                {siteConfig.whatsapp || "WhatsApp belum dikonfigurasi"}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {siteConfig.name} – All Rights Reserved.
      </div>
    </footer>
  );
}

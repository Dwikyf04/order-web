import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-semibold text-white">TaHutech</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Platform pemesanan cepat untuk kebutuhan sekolah Anda.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Kontak</h3>
          <ul className="space-y-2 text-sm">
            {/* EMAIL */}
            <li className="flex items-center gap-2">
              {/* Icon Email */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V6a2 2 0 00-2-2H3a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>

              <a
                href="mailto:orderweb-support@gmail.com"
                className="hover:text-red-500"
              >
                TaHutechsbysdrj@gmail.com
              </a>
            </li>

            {/* WHATSAPP */}
            <li className="flex items-center gap-2">
              {/* Icon WhatsApp */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                viewBox="0 0 32 32"
              >
                <path d="M16.001 3.2c-7.064 0-12.8 5.736-12.8 12.8 0 2.256.592 4.448 1.712 6.4L3.2 28.8l6.592-1.728c1.856.992 3.968 1.536 6.208 1.536 7.064 0 12.8-5.736 12.8-12.8s-5.736-12.8-12.8-12.8zm0 23.2c-1.92 0-3.808-.512-5.44-1.472l-.384-.224-3.904 1.024 1.04-3.808-.256-.4a10.48 10.48 0 01-1.568-5.568c0-5.792 4.72-10.512 10.512-10.512 5.792 0 10.512 4.72 10.512 10.512S21.793 26.4 16.001 26.4zm5.296-7.552c-.288-.144-1.696-.832-1.952-.928-.256-.096-.448-.144-.64.144-.192.288-.736.928-.896 1.12-.16.192-.32.224-.608.08-.288-.144-1.216-.448-2.32-1.424-.864-.768-1.44-1.712-1.6-2-.16-.288-.016-.448.128-.592.128-.128.288-.32.432-.48.144-.16.192-.288.288-.48.096-.192.048-.36-.016-.512-.064-.144-.64-1.536-.88-2.112-.224-.544-.448-.48-.64-.48-.16 0-.352-.032-.544-.032-.192 0-.512.064-.784.352-.272.288-1.04 1.016-1.04 2.48 0 1.464 1.064 2.864 1.216 3.056.16.192 2.096 3.2 5.152 4.48 3.056 1.28 3.056.864 3.616.8.56-.064 1.696-.688 1.936-1.36.24-.672.24-1.248.176-1.36-.064-.112-.256-.176-.544-.32z" />
              </svg>

              <a
                href="https://wa.me/6281234567890"
                className="hover:text-green-600"
              >
                +62 812-2222-01235
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TaHutech – All Rights Reserved.
      </div>
    </footer>
  );
}

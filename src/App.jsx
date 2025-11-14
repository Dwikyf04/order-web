// src/App.jsx
import React from 'react';

// Ini adalah komponen Layout. 
// Perhatikan props { children }
export default function App({ children }) {
  return (
    // Background abu-abu muda untuk seluruh halaman
    <div className="min-h-screen bg-slate-100"> 
      
      {/* ===== NAVBAR ===== */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-8">
          
          <div className="text-2xl font-bold text-blue-700">
            CV. Sejahtera
          </div>

          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-700">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-700">Katalog</a>
            <a href="#" className="text-blue-700 font-semibold border-b-2 border-blue-700">
              Pemesanan
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative text-gray-600 hover:text-blue-700">
              <span>🛒</span> 
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                1
              </span>
            </button>
            <button className="text-gray-600 hover:text-blue-700">
              <span>👤</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ===== KONTEN UTAMA ===== */}
      {/* Di sinilah {children} (yaitu, form & sidebar dari OrderPage) akan dirender */}
      <main className="container mx-auto p-8">
        {children} 
      </main>

    </div>
  );
}

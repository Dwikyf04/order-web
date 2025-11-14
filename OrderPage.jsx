// src/OrderPage.jsx

// 1. Impor React, state, dan App (layout)
import React, { useState, useMemo, useRef } from "react";
import App from "./App"; // -> Impor layout App.jsx baru kita

// 2. Gunakan logic Anda yang sudah ada
export default function OrderPage() {
  // Ini semua logic state dari file Anda sebelumnya (SAYA TIDAK MENGUBAH INI)
  const initialProducts = [
    { id: 1, sku: "KAT-01", name: "Buku Tulis A4 (Isi 50)", price: 12000 },
    { id: 2, sku: "KAT-02", name: "Pensil HB (Pack 12)", price: 25000 },
    { id: 3, sku: "KAT-03", name: "Pulpen Gel Hitam (1)", price: 8000 },
    { id: 4, sku: "KAT-04", name: "Penghapus + Rautan (Set)", price: 6000 },
  ];
  const [products] = useState(initialProducts);
  const [cart, setCart] = useState({});
  const [school, setSchool] = useState({
    nama: "",
    alamat: "",
    kecamatan: "",
    kabupaten: "",
    kontak: "",
    penanggung_jawab: "",
  });
  const [customerNote, setCustomerNote] = useState("");
  const [orderCreated, setOrderCreated] = useState(null);
  const invoiceRef = useRef();

  // Ini semua fungsi Anda (SAYA TIDAK MENGUBAH INI)
  const add = (productId, qty = 1) => {
    setCart((c) => {
      const cur = { ...c };
      cur[productId] = (cur[productId] || 0) + qty;
      if (cur[productId] <= 0) delete cur[productId];
      return cur;
    });
  };
  const items = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const p = products.find((x) => x.id === parseInt(id, 10));
      return { ...p, qty };
    });
  }, [cart, products]);
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);


  // 3. Gunakan RETURN BARU yang sesuai desain target
  // Kode JSX lama Anda (return) saya ganti total dengan kode ini
  return (
    // Gunakan <App> sebagai pembungkus. 
    // Semua di dalamnya akan menjadi {children} di App.jsx
    <App>
      {/* Ini adalah layout 2 kolom utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- KOLOM KIRI (Form) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* --- Card Masukkan Data Sekolah --- */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full">
                1
              </span>
              <h2 className="text-xl font-semibold text-gray-800">Masukkan Data Sekolah</h2>
            </div>

            {/* Form Grid */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Sekolah */}
              <div>
                <label htmlFor="nama-sekolah" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Sekolah
                </label>
                <input 
                  type="text" 
                  id="nama-sekolah" 
                  placeholder="Masukkan nama sekolah"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  // Menghubungkan ke state Anda
                  value={school.nama}
                  onChange={(e) => setSchool({ ...school, nama: e.target.value })}
                />
              </div>
              
              {/* Nama Kontak */}
              <div>
                <label htmlFor="nama-kontak" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kontak
                </label>
                <input 
                  type="text" 
                  id="nama-kontak" 
                  placeholder="Masukkan nama kontak"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  // Menghubungkan ke state Anda
                  value={school.penanggung_jawab}
                  onChange={(e) => setSchool({ ...school, penanggung_jawab: e.target.value })}
                />
              </div>

              {/* Alamat Lengkap */}
              <div className="md:col-span-2">
                <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea 
                  id="alamat" 
                  rows="4"
                  placeholder="Masukkan alamat lengkap sekolah"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  // Menghubungkan ke state Anda
                  value={school.alamat}
                  onChange={(e) => setSchool({ ...school, alamat: e.target.value })}
                ></textarea>
              </div>
              
              {/* No. Telepon */}
              <div>
                <label htmlFor="telepon" className="block text-sm font-medium text-gray-700 mb-1">
                  No. Telepon
                </label>
                <input 
                  type="text" 
                  id="telepon" 
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  // Menghubungkan ke state Anda
                  value={school.kontak}
                  onChange={(e) => setSchool({ ...school, kontak: e.target.value })}
                />
              </div>

              {/* Email (Opsional) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Opsional)
                </label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="email@sekolah.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tombol Lanjut */}
              <div className="md:col-span-2 text-right">
                <button type="button" className="w-full md:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
                  Lanjut ke Pemilihan Produk
                </button>
              </div>
            </form>
          </div>

          {/* --- Card Pilih Produk (Placeholder) --- */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full">
                2
              </span>
              <h2 className="text-xl font-semibold text-gray-800">Pilih Produk</h2>
            </div>
            {/* Di sinilah Anda akan me-render daftar produk dari logic Anda */}
            <div className="space-y-4">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <div className="text-sm text-gray-500">{p.sku}</div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">Rp {p.price.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => add(p.id, -1)} className="px-2 py-1 rounded border">-</button>
                    <input type="number" readOnly value={cart[p.id] || 0} className="w-16 text-center rounded border px-2 py-1" />
                    <button onClick={() => add(p.id, 1)} className="px-2 py-1 rounded bg-blue-600 text-white">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* --- KOLOM KANAN (Sidebar) --- */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card Ulasan dan rating */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ulasan dan rating</h3>
            <p className="text-5xl font-bold text-gray-900">4.99</p>
            <div className="flex justify-center text-3xl text-yellow-400 my-2">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-sm text-gray-500">Berdasarkan total 11.231 rating</p>
          </div>

          {/* Card Butuh Bantuan? */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Butuh Bantuan?</h3>
            <p className="text-sm text-gray-500">Kamu bisa hubungi admin disini.</p>
          </div>

          {/* Card Ringkasan Pesanan */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Ringkasan Pesanan</h3>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Total Item:</span>
              <span className="font-semibold text-gray-900">{items.length} produk</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-4">
              <span>Total Harga:</span>
              <span className="font-semibold text-blue-600">Rp {subtotal.toLocaleString()}</span>
            </div>
            <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-300">
              Pesan Sekarang!
            </button>
          </div>

        </div>

      </div>
    </App>
  );
}

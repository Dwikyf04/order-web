// README
// Single-file React component (default export) that implements a complete one-page ordering website
// - Uses Tailwind CSS for styling (no imports required if your project already includes Tailwind)
// - Features:
//   1) School information form
//   2) Product catalog with quantity selectors
//   3) Cart + order review
//   4) Generate printable invoice / nota
//   5) Basic validation and responsive layout
// How to use:
// 1) Create a new React app (Vite or Create React App). Install Tailwind and enable JIT per Tailwind docs.
// 2) Drop this file as `OrderPage.jsx` and import + render it in your app (e.g. in App.jsx).
// 3) For production deployment (free): push to GitHub and deploy with Vercel or Netlify. Or use GitHub Pages (for CRA).

import React, { useState, useMemo, useRef } from "react";

export default function OrderPage() {
  // sample product catalog — replace with API calls or CMS as needed
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

  const add = (productId, qty = 1) => {
    setCart((c) => {
      const cur = { ...c };
      cur[productId] = (cur[productId] || 0) + qty;
      if (cur[productId] <= 0) delete cur[productId];
      return cur;
    });
  };

  const setQty = (productId, qty) => {
    setCart((c) => {
      const cur = { ...c };
      if (qty <= 0) {
        delete cur[productId];
      } else {
        cur[productId] = qty;
      }
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
  const tax = Math.round(subtotal * 0.0); // change if needed
  const shipping = subtotal > 0 ? 5000 : 0; // example flat fee
  const total = subtotal + tax + shipping;

  function validateSchool() {
    const required = ["nama", "alamat", "kontak", "penanggung_jawab"];
    for (const k of required) {
      if (!school[k] || school[k].trim() === "") return false;
    }
    return true;
  }

  function createOrder() {
    if (items.length === 0) {
      alert("Keranjang kosong — pilih minimal 1 produk.");
      return;
    }
    if (!validateSchool()) {
      alert("Lengkapi data sekolah (Nama, Alamat, Kontak, Penanggung Jawab).");
      return;
    }

    // In real app: send to server / email / whatsapp etc. Here we create a mock order object
    const order = {
      id: `ORD-${Date.now()}`,
      created_at: new Date().toISOString(),
      school: { ...school },
      items: items.map((it) => ({ id: it.id, name: it.name, price: it.price, qty: it.qty })),
      subtotal,
      tax,
      shipping,
      total,
      note: customerNote,
    };

    setOrderCreated(order);
    // Optionally clear cart: setCart({});
  }

  function printInvoice() {
    // simple print of the invoice div
    if (!orderCreated) {
      alert("Buat pesanan terlebih dahulu untuk melihat/print nota.");
      return;
    }
    // Print only the invoice area — create a new window with the invoice HTML
    const printContent = invoiceRef.current?.innerHTML;
    if (!printContent) return;
    const w = window.open("", "PRINT", "height=700,width=900");
    w.document.write(`<!doctype html><html><head><title>Nota ${orderCreated.id}</title>`);
    // minimal inline styles for print — Tailwind isn't available in new window, so include basic styles
    w.document.write(`<style>body{font-family:Arial,Helvetica,sans-serif;padding:16px}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ddd;text-align:left}h2{margin:0 0 8px 0}</style>`);
    w.document.write(`</head><body>${printContent}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 300);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-sky-700">CV. Sejahtera — Pengadaan Barang Sekolah</h1>
            <p className="text-sm text-gray-600">Isi data sekolah → pilih katalog → buat pesanan → cetak nota</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Kontak: 0812-xxxx-xxxx</div>
            <div className="text-xs text-gray-400">Email: procurement@sejahtera.id</div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: School Form */}
          <section className="lg:col-span-1 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Data Sekolah</h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-gray-700">Nama Sekolah</span>
                <input className="mt-1 block w-full rounded border-gray-200 shadow-sm" value={school.nama} onChange={(e)=>setSchool({...school,nama:e.target.value})} />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">Alamat</span>
                <input className="mt-1 block w-full rounded border-gray-200 shadow-sm" value={school.alamat} onChange={(e)=>setSchool({...school,alamat:e.target.value})} />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-sm text-gray-700">Kecamatan</span>
                  <input className="mt-1 block w-full rounded border-gray-200 shadow-sm" value={school.kecamatan} onChange={(e)=>setSchool({...school,kecamatan:e.target.value})} />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-700">Kabupaten/Kota</span>
                  <input className="mt-1 block w-full rounded border-gray-200 shadow-sm" value={school.kabupaten} onChange={(e)=>setSchool({...school,kabupaten:e.target.value})} />
                </label>
              </div>

              <label className="block">
                <span className="text-sm text-gray-700">Kontak / Telp</span>
                <input className="mt-1 block w-full rounded border-gray-200 shadow-sm" value={school.kontak} onChange={(e)=>setSchool({...school,kontak:e.target.value})} />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">Penanggung Jawab</span>
                <input className="mt-1 block w-full rounded border-gray-200 shadow-sm" value={school.penanggung_jawab} onChange={(e)=>setSchool({...school,penanggung_jawab:e.target.value})} />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">Catatan (opsional)</span>
                <textarea className="mt-1 block w-full rounded border-gray-200 shadow-sm" rows={3} value={customerNote} onChange={(e)=>setCustomerNote(e.target.value)} />
              </label>

              <div className="flex gap-2 mt-2">
                <button onClick={()=>{setSchool({nama:'',alamat:'',kecamatan:'',kabupaten:'',kontak:'',penanggung_jawab:''}); setCustomerNote('')}} className="px-3 py-2 rounded bg-gray-100">Reset</button>
                <button onClick={createOrder} className="ml-auto px-4 py-2 rounded bg-sky-600 text-white">Buat Pesanan / Tampilkan Nota</button>
              </div>
            </div>
          </section>

          {/* MIDDLE: Catalog */}
          <section className="lg:col-span-1 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Katalog Produk</h2>
            <div className="space-y-4">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <div className="text-sm text-gray-500">{p.sku}</div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">Rp {p.price.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>add(p.id,-1)} className="px-2 py-1 rounded border">-</button>
                    <input type="number" value={cart[p.id]||0} onChange={(e)=>setQty(p.id, Math.max(0, parseInt(e.target.value||0)))} className="w-16 text-center rounded border px-2 py-1" />
                    <button onClick={()=>add(p.id,1)} className="px-2 py-1 rounded bg-sky-600 text-white">+</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT: Cart & Invoice Preview */}
          <aside className="lg:col-span-1 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-3">
              <div>
                {items.length === 0 ? (
                  <div className="text-sm text-gray-500">Keranjang kosong</div>
                ) : (
                  <ul className="space-y-2">
                    {items.map((it) => (
                      <li key={it.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{it.name}</div>
                          <div className="text-xs text-gray-500">{it.qty} × Rp {it.price.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div>Rp {(it.price * it.qty).toLocaleString()}</div>
                          <div className="flex gap-1 mt-1">
                            <button onClick={()=>add(it.id,-1)} className="text-sm px-2 rounded border">-</button>
                            <button onClick={()=>add(it.id,1)} className="text-sm px-2 rounded border">+</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>Rp {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-gray-600"><span>Ongkir</span><span>Rp {shipping.toLocaleString()}</span></div>
                <div className="flex justify-between font-semibold text-lg mt-2"><span>Total</span><span>Rp {total.toLocaleString()}</span></div>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={()=>{setCart({}); setOrderCreated(null);}} className="px-3 py-2 rounded border">Kosongkan Keranjang</button>
                <button onClick={createOrder} className="ml-auto px-4 py-2 rounded bg-green-600 text-white">Konfirmasi Pesanan</button>
              </div>

              {orderCreated && (
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-2">Pesanan berhasil dibuat: <strong>{orderCreated.id}</strong></div>
                  <div className="flex gap-2">
                    <button onClick={printInvoice} className="px-3 py-2 rounded bg-sky-600 text-white">Cetak Nota</button>
                    <button onClick={()=>navigator.clipboard.writeText(JSON.stringify(orderCreated))} className="px-3 py-2 rounded border">Salin JSON</button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </main>

        {/* Invoice area (hidden or visible) */}
        <div className="mt-10">
          <div ref={invoiceRef} className="bg-white p-6 rounded shadow max-w-2xl mx-auto" id="invoice-area">
            {!orderCreated ? (
              <div className="text-center text-gray-500 py-12">Nota akan tampil di sini setelah Anda membuat pesanan.</div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Nota Pemesanan</h2>
                    <div className="text-sm text-gray-500">ID: {orderCreated.id}</div>
                    <div className="text-xs text-gray-400">Tanggal: {new Date(orderCreated.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">CV. Sejahtera</div>
                    <div className="text-sm text-gray-500">Jl. Contoh No.1, Surabaya</div>
                    <div className="text-sm text-gray-500">Telp: 0812-xxxx-xxxx</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-semibold">Data Sekolah</div>
                  <div className="text-sm">{orderCreated.school.nama}</div>
                  <div className="text-sm text-gray-500">{orderCreated.school.alamat} — {orderCreated.school.kecamatan} — {orderCreated.school.kabupaten}</div>
                  <div className="text-sm">Penanggung Jawab: {orderCreated.school.penanggung_jawab} ({orderCreated.school.kontak})</div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nama Produk</th>
                      <th>Harga</th>
                      <th>Qty</th>
                      <th>Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderCreated.items.map((it, idx) => (
                      <tr key={it.id}>
                        <td>{idx+1}</td>
                        <td>{it.name}</td>
                        <td>Rp {it.price.toLocaleString()}</td>
                        <td>{it.qty}</td>
                        <td>Rp {(it.price * it.qty).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="text-right font-semibold">Subtotal</td>
                      <td>Rp {orderCreated.subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="text-right">Ongkir</td>
                      <td>Rp {orderCreated.shipping.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="text-right font-bold">Total</td>
                      <td className="font-bold">Rp {orderCreated.total.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>

                {orderCreated.note && (
                  <div className="mt-4">
                    <div className="font-semibold">Catatan</div>
                    <div className="text-sm text-gray-700">{orderCreated.note}</div>
                  </div>
                )}

                <div className="mt-8 text-sm text-gray-600">Terima kasih, pesanan akan diproses setelah konfirmasi pembayaran.</div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-gray-400">© {new Date().getFullYear()} CV. Sejahtera — dibuat dengan React + Tailwind</footer>
      </div>
    </div>
  );
}

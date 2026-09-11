import React from "react";

export default function Filters({ filters, onChange, onReset }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
      <input
        aria-label="Cari order"
        className="border rounded-lg px-3 py-2"
        placeholder="Cari sekolah atau nomor order"
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value })}
      />
      <select
        aria-label="Filter pembayaran"
        className="border rounded-lg px-3 py-2"
        value={filters.payment}
        onChange={(event) => onChange({ payment: event.target.value })}
      >
        <option value="">Semua pembayaran</option>
        <option value="Belum">Belum</option>
        <option value="Lunas">Lunas</option>
      </select>
      <select
        aria-label="Filter pengiriman"
        className="border rounded-lg px-3 py-2"
        value={filters.delivery}
        onChange={(event) => onChange({ delivery: event.target.value })}
      >
        <option value="">Semua pengiriman</option>
        <option value="Belum Terkirim">Belum Terkirim</option>
        <option value="Terkirim">Terkirim</option>
      </select>
      <button
        type="button"
        onClick={onReset}
        className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
      >
        Reset Filter
      </button>
    </div>
  );
}

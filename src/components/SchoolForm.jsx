import React, { useState } from "react";

export default function SchoolForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    district: "",
    phone: "",
    budget: "",
    customerName: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submitForm(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Data Sekolah</h3>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        onSubmit={submitForm}
      >
        <input
          className="input"
          name="name"
          placeholder="Nama Sekolah"
          onChange={handleChange}
          required
        />
        <input
          className="input"
          name="address"
          placeholder="Alamat Sekolah"
          onChange={handleChange}
          required
        />
        <input
          className="input"
          name="city"
          placeholder="Kota"
          onChange={handleChange}
          required
        />
        <input
          className="input"
          name="district"
          placeholder="Kecamatan"
          onChange={handleChange}
          required
        />
        <input
          className="input"
          name="phone"
          placeholder="Nomor Telepon"
          onChange={handleChange}
          required
        />

        <select
          className="input"
          name="budget"
          onChange={handleChange}
          required
        >
          <option value="">Pilih Bulan Anggaran</option>
          <option value="januari">Januari</option>
          <option value="februari">Februari</option>
          <option value="maret">Maret</option>
          <option value="april">April</option>
          <option value="mei">Mei</option>
          <option value="juni">Juni</option>
          <option value="juli">Juli</option>
          <option value="agustus">Agustus</option>
          <option value="september">September</option>
          <option value="oktober">Oktober</option>
          <option value="november">November</option>
          <option value="desember">Desember</option>
        </select>

        <input
          className="input"
          name="customerName"
          placeholder="Nama PIC/Pemesan (opsional)"
          onChange={handleChange}
        />

        <button className="sm:col-span-2 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg mt-2 font-semibold">
          Simpan Data
        </button>
      </form>
    </div>
  );
}

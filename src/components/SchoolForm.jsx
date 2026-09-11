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
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
          <option value="">Pilih Rentang Anggaran</option>
          <option value="under-10m">Di bawah Rp10 juta</option>
          <option value="10m-50m">Rp10–50 juta</option>
          <option value="50m-100m">Rp50–100 juta</option>
          <option value="over-100m">Di atas Rp100 juta</option>
        </select>

        <input
          className="input"
          name="customerName"
          placeholder="Nama PIC/Pemesan (opsional)"
          onChange={handleChange}
        />

        <button className="col-span-2 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg mt-2">
          Simpan Data
        </button>
      </form>
    </div>
  );
}

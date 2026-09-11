import React, { useEffect, useMemo, useState } from "react";
import {
  createCatalogProduct,
  listAdminCatalog,
  listCategories,
  removeCatalogProduct,
  updateCatalogProduct,
} from "../../infrastructure/catalog/catalogRepository";

const emptyForm = {
  name: "",
  description: "",
  unit: "Unit",
  base_price: "0",
  image_url: "",
  category_id: "",
  is_featured: false,
  active: true,
  sort_order: "0",
  variants: "",
};

function toForm(product) {
  return {
    name: product.name,
    description: product.description || "",
    unit: product.unit || "Unit",
    base_price: product.base_price,
    image_url: product.image_url || "",
    category_id: product.category_id,
    is_featured: product.is_featured,
    active: product.active,
    sort_order: product.sort_order || 0,
    variants: (product.product_variants || [])
      .filter((variant) => variant.active !== false)
      .map((variant) => `${variant.name}|${variant.price}|${variant.image_url || ""}`)
      .join("\n"),
  };
}

function parseVariants(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, price, image_url = ""] = line.split("|").map((item) => item.trim());
      return { name, price: Number(price || 0), image_url, legacy_key: name };
    })
    .filter((variant) => variant.name && variant.price >= 0);
}

export default function CatalogAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [catalog, categoryRows] = await Promise.all([listAdminCatalog(), listCategories()]);
      setProducts(catalog);
      setCategories(categoryRows);
      setForm((current) => ({ ...current, category_id: current.category_id || categoryRows[0]?.id || "" }));
    } catch (loadError) {
      setError(loadError.message || "Gagal memuat katalog.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => !query || product.name.toLowerCase().includes(query));
  }, [products, search]);

  function setField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function edit(product) {
    setEditingId(product.id);
    setForm(toForm(product));
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setEditingId(null);
    setForm({ ...emptyForm, category_id: categories[0]?.id || "" });
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    const product = {
      name: form.name.trim(),
      description: form.description.trim(),
      unit: form.unit.trim() || "Unit",
      base_price: Number(form.base_price || 0),
      image_url: form.image_url.trim() || null,
      category_id: form.category_id,
      is_featured: form.is_featured,
      active: form.active,
      sort_order: Number(form.sort_order || 0),
    };
    try {
      const variants = parseVariants(form.variants);
      if (!product.name || !product.category_id) throw new Error("Nama dan kategori wajib diisi.");
      if (editingId) await updateCatalogProduct(editingId, product, variants);
      else await createCatalogProduct(product, variants);
      await load();
      reset();
      setMessage(editingId ? "Produk berhasil diperbarui." : "Produk berhasil ditambahkan.");
    } catch (submitError) {
      setError(submitError.message || "Gagal menyimpan produk.");
    }
  }

  async function remove(product) {
    if (!window.confirm(`Nonaktifkan produk ${product.name}?`)) return;
    try {
      await removeCatalogProduct(product.id);
      await load();
      setMessage("Produk berhasil dinonaktifkan.");
    } catch (removeError) {
      setError(removeError.message || "Gagal menonaktifkan produk.");
    }
  }

  return (
    <section className="mt-8 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6">
      <form onSubmit={submit} className="bg-white rounded-xl shadow p-5 space-y-4 h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{editingId ? "Edit Produk" : "Tambah Produk"}</h2>
          {editingId && <button type="button" onClick={reset} className="text-sm text-gray-500">Batal</button>}
        </div>
        {message && <p className="bg-green-50 text-green-700 p-3 rounded">{message}</p>}
        {error && <p className="bg-red-50 text-red-700 p-3 rounded">{error}</p>}
        <input name="name" value={form.name} onChange={setField} placeholder="Nama produk" required className="w-full border rounded p-2" />
        <textarea name="description" value={form.description} onChange={setField} placeholder="Deskripsi" rows="3" className="w-full border rounded p-2" />
        <div className="grid grid-cols-2 gap-3">
          <select name="category_id" value={form.category_id} onChange={setField} required className="border rounded p-2">
            <option value="">Pilih kategori</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input name="unit" value={form.unit} onChange={setField} placeholder="Satuan" className="border rounded p-2" />
          <input name="base_price" type="number" min="0" value={form.base_price} onChange={setField} placeholder="Harga dasar" className="border rounded p-2" />
          <input name="sort_order" type="number" value={form.sort_order} onChange={setField} placeholder="Urutan" className="border rounded p-2" />
        </div>
        <input name="image_url" value={form.image_url} onChange={setField} placeholder="URL gambar WebP" className="w-full border rounded p-2" />
        <textarea name="variants" value={form.variants} onChange={setField} placeholder={'Tipe|Harga|URL gambar WebP\nTipe 2|Harga|URL gambar WebP'} rows="4" className="w-full border rounded p-2 font-mono text-sm" />
        <div className="flex gap-4 text-sm">
          <label><input name="is_featured" type="checkbox" checked={form.is_featured} onChange={setField} /> Unggulan</label>
          <label><input name="active" type="checkbox" checked={form.active} onChange={setField} /> Aktif</label>
        </div>
        <button className="w-full bg-blue-700 text-white rounded p-2 font-bold">{editingId ? "Simpan Perubahan" : "Tambah Produk"}</button>
      </form>

      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold">Kelola Katalog</h2>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari produk" className="border rounded p-2" />
        </div>
        {loading ? <p className="text-gray-500">Memuat katalog...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th className="p-2">Produk</th><th className="p-2">Kategori</th><th className="p-2">Tipe</th><th className="p-2">Status</th><th className="p-2">Aksi</th></tr></thead>
              <tbody>{filteredProducts.map((product) => (
                <tr key={product.id} className="border-b align-top">
                  <td className="p-2 font-medium">{product.name}</td>
                  <td className="p-2">{product.categories?.name || "-"}</td>
                  <td className="p-2">{product.product_variants?.length || 0}</td>
                  <td className="p-2">{product.active ? "Aktif" : "Nonaktif"}</td>
                  <td className="p-2 whitespace-nowrap"><button onClick={() => edit(product)} className="text-blue-700 mr-3">Edit</button><button onClick={() => remove(product)} className="text-red-700">Nonaktifkan</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

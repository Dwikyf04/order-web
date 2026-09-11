export function validateOrderInput({ school, items }) {
  const errors = {};

  if (!school?.name?.trim()) errors.schoolName = "Nama sekolah wajib diisi.";
  if (!school?.address?.trim()) errors.address = "Alamat sekolah wajib diisi.";
  if (!school?.city?.trim()) errors.city = "Kota wajib diisi.";
  if (!school?.district?.trim()) errors.district = "Kecamatan wajib diisi.";
  if (!school?.phone?.trim()) errors.phone = "Nomor telepon wajib diisi.";
  if (!school?.budget?.trim()) errors.budget = "Anggaran wajib diisi.";
  if (!Array.isArray(items) || items.length === 0) {
    errors.items = "Minimal satu produk harus dipilih.";
  }

  if (Array.isArray(items)) {
    items.forEach((item, index) => {
      if (!item.productId) errors[`items.${index}.productId`] = "Produk tidak valid.";
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        errors[`items.${index}.quantity`] = "Jumlah produk harus minimal 1.";
      }
    });
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export async function exportOrdersToExcel(orders) {
  const XLSX = await import("xlsx");
  const rows = orders.map((order) => ({
    "ID Order": order.order_code,
    Tanggal: new Date(order.created_at).toLocaleDateString("id-ID"),
    "Nama Sekolah": order.school_name || "-",
    Pemesan: order.customer_name || "-",
    "Detail Barang": (order.order_items || [])
      .map((item) => `${item.quantity}x ${item.product_name_snapshot}`)
      .join(", "),
    "Total Harga": Number(order.total_price || 0),
    "Status Pembayaran": order.payment_status || "Belum",
    "Status Pengiriman": order.delivery_status || "Belum Terkirim",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 18 },
    { wch: 15 },
    { wch: 25 },
    { wch: 20 },
    { wch: 50 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");
  XLSX.writeFile(
    workbook,
    `Laporan_Order_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}

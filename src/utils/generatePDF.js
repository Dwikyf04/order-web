// src/utils/generatePDF.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 1. Ubah argumen agar sesuai dengan App.jsx
export default function generatePDF(schoolData, cart, totalPrice) {
  try {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString("id-ID");
    const orderId = `ORD-${Date.now()}`;

    // === HEADER ===
    doc.setFontSize(18);
    doc.text("CV. SEJAHTERA", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("Pengadaan Barang Elektronik & Keperluan Sekolah", 105, 22, {
      align: "center",
    });
    doc.setLineWidth(1);
    doc.line(14, 28, 196, 28);

    // === INFO DOKUMEN ===
    doc.setFontSize(14);
    doc.text("DOKUMEN PEMESANAN", 105, 38, { align: "center" });
    doc.setFontSize(10);
    doc.text(`No. Order: ${orderId}`, 14, 48);
    doc.text(`Tanggal: ${today}`, 14, 54);

    // === DATA SEKOLAH ===
    doc.text("DATA SEKOLAH", 14, 64);
    autoTable(doc, {
      startY: 68,
      body: [
        ["Nama Sekolah", schoolData.nama || "-"],
        ["Alamat Sekolah", schoolData.alamat || "-"],
        [
          "Kota/Kecamatan",
          `${schoolData.kota || "-"} / ${schoolData.kecamatan || "-"}`,
        ],
        ["Nomor Telepon", schoolData.telepon || "-"],
        ["Anggaran", schoolData.anggaran || "-"],
      ],
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 1 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
    });

    // === DAFTAR PRODUK (BARU) ===
    doc.text("NAMA BARANG DIPESAN", 14, doc.lastAutoTable.finalY + 10);

    // 2. Ubah productRows agar me-loop dari 'cart'
    const productRows = cart.map((item, index) => [
      index + 1,
      item.nama,
      item.spesifikasi,
      1, // Ganti ini jika Anda menambahkan logika jumlah
      item.satuan,
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["No", "Nama Barang", "Spesifikasi", "Jumlah", "Satuan"]],
      body: productRows,
      theme: "grid",
      headStyles: { fillColor: [0, 51, 102] },
    });

    // === TOTAL HARGA (BARU) ===
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Pembayaran: Rp ${totalPrice.toLocaleString()}`,
      196,
      doc.lastAutoTable.finalY + 15,
      { align: "right" }
    );

    // === TANDA TANGAN ===
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Pihak Sekolah", 40, doc.lastAutoTable.finalY + 50, {
      align: "center",
    });
    doc.text("(Nama & Tanda Tangan)", 40, doc.lastAutoTable.finalY + 75, {
      align: "center",
    });

    doc.text("CV. Sejahtera", 170, doc.lastAutoTable.finalY + 50, {
      align: "center",
    });
    doc.text("(Nama & Tanda Tangan)", 170, doc.lastAutoTable.finalY + 75, {
      align: "center",
    });

    // Simpan PDF
    doc.save(`Nota-${schoolData.nama}-${orderId}.pdf`);
  } catch (error) {
    console.error("Gagal generate PDF:", error);
    alert("Maaf, terjadi error internal saat membuat PDF.");
  }
}

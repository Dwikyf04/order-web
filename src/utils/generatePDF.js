// src/utils/generatePDF.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generatePDF(schoolData, cart, totalPrice) {
  try {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const orderId = `ORD-${Date.now()}`;

    // === HEADER ===
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("CV. SEJAHTERA", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Pengadaan Barang Elektronik & Keperluan Sekolah", 105, 22, {
      align: "center",
    });
    doc.setLineWidth(0.5);
    doc.line(14, 26, 196, 26);

    // === INFO DOKUMEN ===
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("LEMBAR PEMESANAN", 105, 38, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`No. Order: ${orderId}`, 14, 48);
    doc.text(`Tanggal: ${today}`, 14, 54);

    // === DATA SEKOLAH ===
    doc.setFont("helvetica", "bold");
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

    // === DAFTAR PRODUK ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("NAMA BARANG DIPESAN", 14, doc.lastAutoTable.finalY + 10);

    // UPDATE 1: Menggunakan item.qty agar jumlahnya sesuai input user
    const productRows = cart.map((item, index) => [
      index + 1,
      item.nama,
      item.spesifikasi,
      item.qty || 1, // <-- Mengambil qty dari keranjang
      item.satuan,
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["No", "Nama Barang", "Spesifikasi", "Jumlah", "Satuan"]],
      body: productRows,
      theme: "grid",
      headStyles: { fillColor: [0, 51, 102] }, // Warna Header Biru Tua
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        3: { cellWidth: 20, halign: "center" },
        4: { cellWidth: 20, halign: "center" },
      },
    });

    // === TOTAL HARGA ===
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Pembayaran: Rp ${totalPrice.toLocaleString("id-ID")}`,
      196,
      doc.lastAutoTable.finalY + 15,
      { align: "right" }
    );

    // === TANDA TANGAN (YANG DI REVISI) ===
    const finalY = doc.lastAutoTable.finalY + 40; // Jarak dari tabel

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Kiri: Pihak Sekolah
    doc.text("Pihak Sekolah", 50, finalY, { align: "center" });

    // UPDATE 2: Mengisi Nama Sekolah secara otomatis & diberi garis bawah/kurung
    // Menggunakan ( Nama Sekolah ) agar terlihat rapi
    const namaSekolahSign = schoolData.nama
      ? `( ${schoolData.nama.toUpperCase()} )`
      : "( ........................... )";

    doc.text(namaSekolahSign, 50, finalY + 25, { align: "center" });

    // Kanan: Penerima (CV)
    doc.text("Penerima", 160, finalY, { align: "center" });
    doc.text("( CV. SEJAHTERA )", 160, finalY + 25, { align: "center" });

    // Simpan PDF
    doc.save(`Nota-${schoolData.nama.replace(/\s+/g, "_")}-${orderId}.pdf`);
  } catch (error) {
    console.error("Gagal generate PDF:", error);
    alert("Maaf, terjadi error internal saat membuat PDF.");
  }
}

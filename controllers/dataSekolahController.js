// controllers/dataSekolahController.js

const DataSekolah = require('../models/DataSekolah');

/**
 * GET /api/data-sekolah
 * Mengambil data sekolah. Diasumsikan hanya ada satu record.
 */
exports.getDataSekolah = async (req, res) => {
  try {
    const data = await DataSekolah.findOne();
    if (!data) {
      return res.status(404).json({ message: "Data sekolah tidak ditemukan" });
    }
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data sekolah:", error);
    res.status(500).json({ message: "Error retrieving data sekolah", error: error.message });
  }
};

/**
 * POST /api/data-sekolah
 * Menambahkan data sekolah baru.
 */
exports.addDataSekolah = async (req, res) => {
  try {
    const {
        npsn,
        status,
        bentukPendidikan,
        statusKepemilikan,
        skPendirian,
        tanggalSkPendirian,
        skIzinOperasional,
        tanggalSkIzinOperasional,
        kebutuhanKhusus,
        namaBank,
        cabang,
        rekeningAtasNama,
        statusBOS,
        waktuPenyelenggaraan,
        sertifikasiISO,
        sumberListrik,
        dayaListrik,
        kecepatanInternet,
        kepsek,
        operator,
        akreditasi,
        kurikulum,
        waktu
    } = req.body;

    // Validasi sederhana
    if (!npsn || !status || !bentukPendidikan || !statusKepemilikan || !skPendirian || !tanggalSkPendirian || !skIzinOperasional || !tanggalSkIzinOperasional) {
      return res.status(400).json({ message: "Data wajib (npsn, status, bentuk pendidikan, status kepemilikan, SK pendirian, tanggal SK pendirian, SK izin operasional, tanggal SK izin operasional) harus diisi." });
    }

    const newData = await DataSekolah.create({
        npsn,
        status,
        bentukPendidikan,
        statusKepemilikan,
        skPendirian,
        tanggalSkPendirian,
        skIzinOperasional,
        tanggalSkIzinOperasional,
        kebutuhanKhusus,
        namaBank,
        cabang,
        rekeningAtasNama,
        statusBOS,
        waktuPenyelenggaraan,
        sertifikasiISO,
        sumberListrik,
        dayaListrik,
        kecepatanInternet,
        kepsek,
        operator,
        akreditasi,
        kurikulum,
        waktu
    });

    res.status(201).json({ message: "Data sekolah berhasil ditambahkan", data: newData });
  } catch (error) {
    console.error("Error adding data sekolah:", error);
    res.status(500).json({ message: "Error adding data sekolah", error: error.message });
  }
};

/**
 * PUT /api/data-sekolah/:id
 * Memperbarui data sekolah berdasarkan ID.
 */
exports.updateDataSekolah = async (req, res) => {
  try {
    const { id } = req.params;
    const {
    npsn,
      status,
      bentukPendidikan,
      statusKepemilikan,
      skPendirian,
      tanggalSkPendirian,
      skIzinOperasional,
      tanggalSkIzinOperasional,
      kebutuhanKhusus,
      namaBank,
      cabang,
      rekeningAtasNama,
      statusBOS,
      waktuPenyelenggaraan,
      sertifikasiISO,
      sumberListrik,
      dayaListrik,
      kecepatanInternet,
      kepsek,
      operator,
      akreditasi,
      kurikulum,
      waktu
    } = req.body;

    const dataSekolah = await DataSekolah.findByPk(id);
    if (!dataSekolah) {
      return res.status(404).json({ message: "Data sekolah tidak ditemukan" });
    }

    dataSekolah.npsn = npsn !== undefined ? npsn : dataSekolah.npsn;
    dataSekolah.status = status !== undefined ? status : dataSekolah.status;
    dataSekolah.bentukPendidikan = bentukPendidikan !== undefined ? bentukPendidikan : dataSekolah.bentukPendidikan;
    dataSekolah.statusKepemilikan = statusKepemilikan !== undefined ? statusKepemilikan : dataSekolah.statusKepemilikan;
    dataSekolah.skPendirian = skPendirian !== undefined ? skPendirian : dataSekolah.skPendirian;
    dataSekolah.tanggalSkPendirian = tanggalSkPendirian !== undefined ? tanggalSkPendirian : dataSekolah.tanggalSkPendirian;
    dataSekolah.skIzinOperasional = skIzinOperasional !== undefined ? skIzinOperasional : dataSekolah.skIzinOperasional;
    dataSekolah.tanggalSkIzinOperasional = tanggalSkIzinOperasional !== undefined ? tanggalSkIzinOperasional : dataSekolah.tanggalSkIzinOperasional;
    dataSekolah.kebutuhanKhusus = kebutuhanKhusus !== undefined ? kebutuhanKhusus : dataSekolah.kebutuhanKhusus;
    dataSekolah.namaBank = namaBank !== undefined ? namaBank : dataSekolah.namaBank;
    dataSekolah.cabang = cabang !== undefined ? cabang : dataSekolah.cabang;
    dataSekolah.rekeningAtasNama = rekeningAtasNama !== undefined ? rekeningAtasNama : dataSekolah.rekeningAtasNama;
    dataSekolah.statusBOS = statusBOS !== undefined ? statusBOS : dataSekolah.statusBOS;
    dataSekolah.waktuPenyelenggaraan = waktuPenyelenggaraan !== undefined ? waktuPenyelenggaraan : dataSekolah.waktuPenyelenggaraan;
    dataSekolah.sertifikasiISO = sertifikasiISO !== undefined ? sertifikasiISO : dataSekolah.sertifikasiISO;
    dataSekolah.sumberListrik = sumberListrik !== undefined ? sumberListrik : dataSekolah.sumberListrik;
    dataSekolah.dayaListrik = dayaListrik !== undefined ? dayaListrik : dataSekolah.dayaListrik;
    dataSekolah.kecepatanInternet = kecepatanInternet !== undefined ? kecepatanInternet : dataSekolah.kecepatanInternet;
    dataSekolah.kepsek = kepsek !== undefined ? kepsek : dataSekolah.kepsek;
    dataSekolah.operator = operator !== undefined ? operator : dataSekolah.operator;
    dataSekolah.akreditasi = akreditasi !== undefined ? akreditasi : dataSekolah.akreditasi;
    dataSekolah.kurikulum = kurikulum !== undefined ? kurikulum : dataSekolah.kurikulum;
    dataSekolah.waktu = waktu !== undefined ? waktu : dataSekolah.waktu;

    await dataSekolah.save();
    res.json({ message: "Data sekolah berhasil diperbarui", data: dataSekolah });
  } catch (error) {
    console.error("Error updating data sekolah:", error);
    res.status(500).json({ message: "Error updating data sekolah", error: error.message });
  }
};

/**
 * DELETE /api/data-sekolah/:id
 * Menghapus data sekolah berdasarkan ID.
 */
exports.deleteDataSekolah = async (req, res) => {
  try {
    const { id } = req.params;
    const dataSekolah = await DataSekolah.findByPk(id);
    if (!dataSekolah) {
      return res.status(404).json({ message: "Data sekolah tidak ditemukan" });
    }
    await dataSekolah.destroy();
    res.json({ message: "Data sekolah berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting data sekolah:", error);
    res.status(500).json({ message: "Error deleting data sekolah", error: error.message });
  }
};

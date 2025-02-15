module.exports = {
  config: {
    nama: "status", // Nama modul
    penulis: "Keel", // Penulis modul
    peran: 0, // Level akses (0 = semua pengguna)
    kuldown: 10, // Cooldown (dalam detik)
    tutor: "status" // Petunjuk penggunaan
  },

  run: async function ({ api, event, args, getData }) {
    try {
      const userId = event.senderID; // Ambil ID pengguna yang mengirim pesan
      const userData = await getData(userId); // Ambil data pengguna dari database

      // Debug: Cetak data pengguna ke konsol
      console.log("Data Pengguna:", userData);

      // Cek apakah data pengguna valid
      if (!userData || typeof userData !== "object") {
        return api.sendMessage("❌ Data pengguna tidak ditemukan atau tidak valid.", event.threadID, event.messageID);
      }

      // Pastikan properti yang diperlukan ada
      if (!userData.nama || !userData.yen || !userData.exp || !userData.level) {
        return api.sendMessage("❌ Data pengguna tidak lengkap.", event.threadID, event.messageID);
      }

      // Format pesan status
      const statusMessage = `
📌 Status Pengguna:
👤 Nama: ${userData.nama}
💰 Yen: ${userData.yen.toFixed(2)}
🌟 Exp: ${userData.exp}
📈 Level: ${userData.level}
      `;

      // Kirim pesan status
      api.sendMessage(statusMessage, event.threadID, event.messageID);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      api.sendMessage("❌ Terjadi kesalahan saat mengambil status pengguna.", event.threadID, event.messageID);
    }
  }
};
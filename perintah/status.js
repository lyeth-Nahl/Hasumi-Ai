module.exports = {
  hady: {
    nama: "status",
    penulis: "Nahl",
    peran: 0,
    kuldown: 5,
    tutor: "[status]"
  },

  bahasa: {
    id: { hadi: "Status pengguna berhasil ditampilkan." },
    en: { hadi: "User status has been displayed successfully." }
  },

  Ayanokoji: async function ({ api, event, args, bhs, getData }) {
    try {
      // Ambil ID pengguna yang mengirim perintah
      const userId = event.senderID;

      // Ambil data pengguna dari database
      const userData = await getData(userId);

      // Jika data pengguna tidak ditemukan
      if (!userData) {
        return api.sendMessage("❌ Data pengguna tidak ditemukan.", event.threadID, event.messageID);
      }

      // Format pesan status
      const statusMessage = `
👤 Nama: ${userData.nama}
💰 Yen: ${userData.yen}
⭐ Exp: ${userData.exp}
📈 Level: ${userData.level}
      `;

      // Kirim pesan status
      api.sendMessage(statusMessage, event.threadID, event.messageID);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      api.sendMessage("❌ Terjadi kesalahan saat menampilkan status.", event.threadID, event.messageID);
    }
  }
};
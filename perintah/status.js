module.exports = {
  hady: { 
    nama: "status",
    penulis: "Keel", 
    peran: 0,
    kuldown: 10,
    tutor: "status" // Perintah tanpa argumen ID custom
  }, 
  
  Ayanokoji: async function ({ api, event, args, bhs, getData }) {
    try {
      const userId = event.senderID; // Ambil ID asli pengguna yang mengirim pesan
      const userData = await getData(userId); // Ambil data pengguna dari database

      // Jika pengguna tidak ditemukan
      if (!userData) {
        return api.sendMessage("❌ Data pengguna tidak ditemukan.", event.threadID, event.messageID);
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
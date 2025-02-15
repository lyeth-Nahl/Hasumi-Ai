module.exports = {
hady: { 
  nama: "status",
  penulis: "Keel", 
  peran: 0,
  kuldown: 10,
  tutor: "status"
}, 
  
Ayanokoji: async function ({ api, event, args, bhs, getData }) {
  try {
    // Cek apakah ada argumen id
    if (!args[0]) {
      return api.sendMessage(bhs.hadi, event.threadID, event.messageID);
    }

    const userId = args[0]; // Ambil id dari argumen
    const userData = await getData(userId); // Ambil data pengguna dari database

    // Jika pengguna tidak ditemukan
    if (!userData || userData.id === "Unknown") {
      return api.sendMessage("❌ Pengguna tidak ditemukan.", event.threadID, event.messageID);
    }

    // Format pesan status
    const statusMessage = `
📌 Status Pengguna:
🆔 ID: ${userData.id}
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
module.exports = {
  hady: { 
    nama: "status", 
    penulis: "Kiel", 
    kuldown: 5,
    peran: 0,
    tutor: "Gunakan {awalan}status untuk melihat statistikmu"
  },
  
  Ayanokoji: async function ({ api, event, getData, updateDatabase }) {
    try {
      let userData = await getData(event.senderID);

      // Jika terjadi error atau data tidak ditemukan
      if (!userData) {
        return api.sendMessage("❌ Gagal mengambil data pengguna. Silakan coba lagi nanti.", event.threadID);
      }
      if (!userData.yen) {

        const db = await fetchDatabase('users');
      // Jika user belum terdaftar
      if (!userData.yen) {
        userData = {
          nama: "Kiyopon User",
          yen: 0,
          exp: 0,
          level: 1,
          daily: null,
          id: Object.keys(db).length + 1
        };
        await updateDatabase(`users/${event.senderID}`, userData); // Simpan data baru ke database
      }

      // Hitung progress exp
      const expProgress = (userData.exp / 2500 * 100).toFixed(2);
      const progressBar = "⬜".repeat(Math.floor(expProgress/10)) + "⬛".repeat(10 - Math.floor(expProgress/10));

      // Format pesan
      const message = `⚡️ STATUS ${userData.nama.toUpperCase()} ⚡️
      
💰 Yen: ${userData.yen.toFixed(2)} ¥
📈 Exp: ${userData.exp}/${2500}
🏆 Level: ${userData.level}
🔋 Progress: ${progressBar} (${expProgress}%)

📅 Terakhir Update: ${global.Ayanokoji.tanggal} ${global.Ayanokoji.waktu}`;

      api.sendMessage(message, event.threadID);
      
    } catch (error) {
      console.error("Error di command status:", error);
      api.sendMessage("❌ Gagal mengambil data status", event.threadID);
    }
  }
};
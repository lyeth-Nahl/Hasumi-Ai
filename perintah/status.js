module.exports = {
  hady: {
    nama: "status",
    penulis: "Kiel",
    kuldown: 5,
    peran: 0,
    tutor: "Gunakan {awalan}status untuk melihat statistikmu"
  },
  Ayanokoji: async function ({ api, event, getData }) {
    try {
      let userData = await getData(event.senderID);
      if (!userData) {
        return api.sendMessage("❌ Gagal mengambil data pengguna. Silakan coba lagi nanti.", event.threadID);
      }
      // Hitung progress exp
      const expProgress = (userData.exp / 2500 * 100).toFixed(2);
      const progressBar = "⬜".repeat(Math.floor(expProgress/10)) + "⬛".repeat(10 - Math.floor(expProgress/10));
      // Format pesan
      const message = `
╭━━━[ STATUS ]
╰╮${userData.nama}
╭╯ Nama: ${userData.nama}
╰╮ Yen: ${userData.yen.toFixed(2)} ¥
╭╯ Exp: ${userData.exp}/${2500}
╰╮ Level: ${userData.level}
╭╯ Daily: ${userData.daily}
╰╮ ID: ${event.senderID}
╭╯ Progress: ${progressBar} (${expProgress}%)
╰━━━[ ${global.Ayanokoji.nama} ]
`;
      api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error("Error di command status:", error);
      api.sendMessage("❌ Gagal mengambil data status", event.threadID);
    }
  }
};
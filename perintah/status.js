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
      // Format pesan
      const message = `
╭━━━[ STATUS ]
╰╮Nama: ${userData.nama}
╭╯ ID: ${userData.id}
╰╮ Yen: ${userData.yen.toFixed(2)} ¥
╭╯ Exp: ${userData.exp}
╰╮ Level: ${userData.level}
╰━━━[ ${global.Ayanokoji.nama} ]
`;
      api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error("Error di command status:", error);
      api.sendMessage("❌ Gagal mengambil data status", event.threadID);
    }
  }
};
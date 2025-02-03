const fs = require('fs');

module.exports = {
  hady: {
    nama: "daily",
    penulis: "Horikita",
    kuldown: 24, // waktu tunggu 24 jam
    peran: 0,
    tutor: ";daily"
  },
  Ayanokoji: async function ({ api, event, args }) {
    const statusPath = './status.json';
    let statusData = {};
    try {
      statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    } catch (err) {
      console.error(err);
    }
    if (!statusData[event.senderID]) {
      return api.sendMessage("Kamu belum memiliki status! Ketik ;status untuk membuat status.", event.threadID);
    }
    const waktuSekarang = new Date().getTime();
    const waktuTerakhirDaily = statusData[event.senderID].waktuTerakhirDaily;
    if (waktuTerakhirDaily && waktuSekarang - waktuTerakhirDaily < 86400000) {
      const waktuTunggu = Math.ceil((86400000 - (waktuSekarang - waktuTerakhirDaily)) / 60000);
      return api.sendMessage(`Kamu sudah melakukan daily hari ini! Tunggu ${waktuTunggu} menit lagi untuk melakukan daily lagi.`, event.threadID);
    }
    statusData[event.senderID].exp += 1200;
    statusData[event.senderID].yen += 2;
    statusData[event.senderID].waktuTerakhirDaily = waktuSekarang;
    fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
    return api.sendMessage(`Selamat! Kamu telah melakukan daily hari ini!\nHadiah: 1200 Exp dan 2 Yen`, event.threadID);
  }
};
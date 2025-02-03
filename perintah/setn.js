const fs = require('fs');

module.exports = {
  hady: {
    nama: "setn",
    penulis: "Horikita",
    kuldown: 5,
    peran: 0,
    tutor: "cmd [setn] [nama baru]"
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
      return api.sendMessage("Kamu belum memiliki status!", event.threadID);
    }
    if (args.length < 1) {
      return api.sendMessage("Nama baru tidak boleh kosong!", event.threadID);
    }
    const namaBaru = args.join(" ");
    if (namaBaru.length > 12) {
      return api.sendMessage("Nama baru tidak boleh lebih dari 12 huruf!", event.threadID);
    }
    if (statusData[event.senderID].yen < 0.15) {
      return api.sendMessage("Yen kamu tidak cukup untuk mengganti nama!", event.threadID);
    }
    statusData[event.senderID].nama = namaBaru;
    statusData[event.senderID].yen -= 0.15;
    fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
    return api.sendMessage(`Nama kamu telah diganti menjadi ${namaBaru}!`, event.threadID);
  }
};
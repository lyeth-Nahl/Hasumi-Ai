const fs = require('fs').promises;
const axios = require('axios');

module.exports = {
  hady: {
    nama: "fish",
    penulis: "Minz",
    kuldown: 40,
    peran: 0,
    tutor: "<cmd/kosong>"
  },
  Ayanokoji: async function ({ api, event, args }) {
    const fish = [
      { nama: "Ikan Mas", harga: 3, kesulitan: 1 },
      { nama: "Ikan Koi", harga: 5, kesulitan: 2 },
      { nama: "Ikan Arwana", harga: 9, kesulitan: 3 },
      { nama: "Ikan Guppy", harga: 1, kesulitan: 1 },
      { nama: "Ikan Neon", harga: 3, kesulitan: 2 },
      { nama: "Ikan Piranha", harga: 5, kesulitan: 3 },
      { nama: "Ikan Shark", harga: 9, kesulitan: 4 },
      { nama: "Ikan Tuna", harga: 3, kesulitan: 2 },
      { nama: "Ikan Salmon", harga: 3, kesulitan: 3 }
    ];

    if (args[0] === "beli") {
      const hargaUmpan = 10;
      const status = await fs.readFile('status.json', 'utf8');
      const dataStatus = JSON.parse(status);
      if (!dataStatus[event.senderID]) {
        dataStatus[event.senderID] = { yen: 0 };
      }
      if (dataStatus[event.senderID].yen >= hargaUmpan) {
        dataStatus[event.senderID].yen -= hargaUmpan;
        await fs.writeFile('status.json', JSON.stringify(dataStatus, null, 2));
        api.sendMessage(`Kamu berhasil membeli umpan!`, event.threadID, event.messageID);
      } else {
        api.sendMessage(`Kamu tidak memiliki yen yang cukup untuk membeli umpan!`, event.threadID, event.messageID);
      }
    } else if (args[0] === "mulai") {
      const kesulitanMancing = Math.floor(Math.random() * 5) + 1;
      const ikanDipilih = fish.find(ikan => ikan.kesulitan === kesulitanMancing);
      if (ikanDipilih) {
        const status = await fs.readFile('status.json', 'utf8');
        const dataStatus = JSON.parse(status);
        if (!dataStatus[event.senderID]) {
          dataStatus[event.senderID] = { yen: 0 };
        }
        dataStatus[event.senderID].yen += ikanDipilih.harga;
        await fs.writeFile('status.json', JSON.stringify(dataStatus, null, 2));
        api.sendMessage(`Kamu berhasil menangkap ${ikanDipilih.nama}! Kamu mendapatkan ${ikanDipilih.harga} yen.`, event.threadID, event.messageID);
      } else {
        api.sendMessage(`Kamu gagal menangkap ikan!`, event.threadID, event.messageID);
      }
    } else {
      api.sendMessage(`Kamu harus menggunakan perintah "beli" untuk membeli umpan atau "mulai" untuk memulai mancing!`, event.threadID, event.messageID);
    }
  }
};
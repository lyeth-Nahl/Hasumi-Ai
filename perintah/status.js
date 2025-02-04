const fs = require('fs');
const axios = require('axios');

module.exports = {
  hady: {
    nama: "status",
    penulis: "Horikita",
    harga: "Free"
    kuldown: 5,
    peran: 0,
    tutor: ";status"
  },
  bahasa: {
    id: { status: "Status kamu:" },
    en: { status: "Your status:" }
  },
  Ayanokoji: async function ({ api, event, args, bhs }) {
    const statusPath = './status.json';
    let statusData = {};

    try {
      statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    } catch (err) {
      console.error(err);
    }

    if (!statusData[event.senderID]) {
      const id = Object.keys(statusData).length + 1;
      statusData[event.senderID] = {
        id: id,
        nama: event.senderName,
        yen: 0,
        level: 1,
        exp: 0,
        peringkat: "Pemula"
      };
    }

    statusData[event.senderID].yen += 0.10;
    statusData[event.senderID].exp += 0.5;

    if (statusData[event.senderID].exp >= 2500) {
      statusData[event.senderID].level += 1;
      statusData[event.senderID].exp -= 2500;
    }

    if (statusData[event.senderID].level >= 10) {
      statusData[event.senderID].peringkat = "Master";
    } else if (statusData[event.senderID].level >= 5) {
      statusData[event.senderID].peringkat = "Senior";
    } else if (statusData[event.senderID].level >= 2) {
      statusData[event.senderID].peringkat = "Junior";
    }

    fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));

    const yen = parseInt(statusData[event.senderID].yen * 100) / 100;
    const statusText = `${bhs('status')}\nNama: ${statusData[event.senderID].nama}\nID: ${statusData[event.senderID].id}\n\nYen: ${yen}\nLevel: ${statusData[event.senderID].level}\nExp: ${statusData[event.senderID].exp}\nPeringkat: ${statusData[event.senderID].peringkat}`;

    api.sendMessage(statusText, event.threadID, event.messageID);
  }
};
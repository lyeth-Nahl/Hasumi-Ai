const fs = require('fs');
const axios = require('axios');

module.exports = {
  hady: {
    nama: "status",
    penulis: "Horikita",
    harga: "Free",
    kuldown: 5,
    peran: 0,
    tutor: ";status"
  },
  bahasa: {
    id: {
      status: "Status kamu:"
    },
    en: {
      status: "Your status:"
    }
  },
  Ayanokoji: async function({ api, event, args, bhs }) {
    const statusPath = './status.json';
    let statusData = {};

    try {
      statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    } catch (err) {
      console.error(err);
      statusData = {};
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
    statusData[event.senderID].exp += 10;

    if (statusData[event.senderID].exp >= 2500) {
      statusData[event.senderID].level += 1;
      statusData[event.senderID].exp = 0;
    }

    if (statusData[event.senderID].level >= 200) {

statusData[event.senderID].peringkat = "Legendary Emperor";

} else if (statusData[event.senderID].level >= 150) {

statusData[event.senderID].peringkat = "Supreme Master";

} else if (statusData[event.senderID].level >= 120) {

statusData[event.senderID].peringkat = "Grandmaster of the Realm";

} else if (statusData[event.senderID].level >= 100) {

statusData[event.senderID].peringkat = "Master of the Universe";

} else if (statusData[event.senderID].level >= 90) {

statusData[event.senderID].peringkat = "Sultan of Skill";

} else if (statusData[event.senderID].level >= 80) {

statusData[event.senderID].peringkat = "Veteran Warrior";

} else if (statusData[event.senderID].level >= 70) {

statusData[event.senderID].peringkat = "Expert of Excellence";

} else if (statusData[event.senderID].level >= 60) {

statusData[event.senderID].peringkat = "Pro of Perfection";

} else if (statusData[event.senderID].level >= 50) {

statusData[event.senderID].peringkat = "Semi-Pro of Skill";

} else if (statusData[event.senderID].level >= 40) {

statusData[event.senderID].peringkat = "Junior Pro of Progress";

} else if (statusData[event.senderID].level >= 30) {

statusData[event.senderID].peringkat = "Advanced Player";

} else if (statusData[event.senderID].level >= 20) {

statusData[event.senderID].peringkat = "Intermediate Player";

} else {

statusData[event.senderID].peringkat = "Newbie";

}

    fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));

    const yen = parseInt(statusData[event.senderID].yen * 100) / 100;
    const statusText = `Status kamu:\n\nNama: ${statusData[event.senderID].nama}\nID: ${statusData[event.senderID].id}\nYen: ${yen}\nLevel: ${statusData[event.senderID].level}\nExp: ${statusData[event.senderID].exp}\nPeringkat: ${statusData[event.senderID].peringkat}`;

    api.sendMessage(statusText, event.threadID, event.messageID);
  }
}
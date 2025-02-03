const fs = require('fs');
const statusFile = 'status.json';

module.exports = {
  hady: {
    nama: "status",
    penulis: "Horikita",
    kuldown: 5,
    peran: 0,
    tutor: "cmd [install|del|load|loadall] [nama perintah]"
  },
  Ayanokoji: async function ({ api, event, args, client, __ }) {
    if (args[0] === "status") {
      const userId = event.senderID;
      let statusData = {};
      try {
        statusData = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
      } catch (err) {
        statusData = {};
      }
      if (!statusData[userId]) {
        statusData[userId] = {
          id: Object.keys(statusData).length + 1,
          nama: event.senderName,
          yen: 0,
          level: 1,
          exp: 0,
          peringkat: "Pemula"
        };
      }
      statusData[userId].yen += 0.10;
      statusData[userId].exp += 0.5;
      if (statusData[userId].exp >= 2500) {
        statusData[userId].level += 1;
        statusData[userId].exp -= 2500;
      }
      if (statusData[userId].level >= 10) {
        statusData[userId].peringkat = "Master";
      } else if (statusData[userId].level >= 5) {
        statusData[userId].peringkat = "Senior";
      } else if (statusData[userId].level >= 2) {
        statusData[userId].peringkat = "Junior";
      }
      fs.writeFileSync(statusFile, JSON.stringify(statusData));
      const statusText = `ID: ${statusData[userId].id}\nNama: ${statusData[userId].nama}\nYen: ${statusData[userId].yen}\nLevel: ${statusData[userId].level}\nExp: ${statusData[userId].exp}\nPeringkat: ${statusData[userId].peringkat}`;
      api.sendMessage(statusText, event.threadID);
    }
  }
};
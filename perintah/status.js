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
  handle: async function ({ api, __ }) {
    const userId = __.user;
    let statusData = {};
    try {
      statusData = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    } catch (err) {
      statusData = {};
    }
    if (!statusData[userId]) {
      const id = Object.keys(statusData).length + 1;
      statusData[userId] = {
        id: id,
        nama: __.name,
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
    return api.sendMessage(statusText, __.threadID);
  }
};
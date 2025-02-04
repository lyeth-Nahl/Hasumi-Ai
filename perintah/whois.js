const fs = require('fs');

module.exports = {
  hady: {
    nama: "whois",
    penulis: "Horikita",
    harga: "0.5",
    kuldown: 5,
    peran: 0,
    tutor: ";whois <id>"
  },
  bahasa: {
    id: {
      whois: "Informasi Pengguna"
    },
    en: {
      whois: "User Information"
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

    if (args.length === 0) {
      api.sendMessage("Silakan masukkan ID pengguna!", event.threadID, event.messageID);
      return;
    }

    const id = parseInt(args[0]);
    if (!statusData[event.senderID]) {
      api.sendMessage("Anda belum memiliki akun!", event.threadID, event.messageID);
      return;
    }

    if (statusData[event.senderID].yen < 0.5) {
      api.sendMessage("Yen Anda tidak cukup!", event.threadID, event.messageID);
      return;
    }

    let targetUser;
    for (const userId in statusData) {
      if (statusData[userId].id === id) {
        targetUser = statusData[userId];
        break;
      }
    }

    if (!targetUser) {
      api.sendMessage("Pengguna dengan ID tersebut tidak ditemukan!", event.threadID, event.messageID);
      return;
    }

    const whoisText = `Informasi Pengguna:\n\nNama: ${targetUser.nama}\nID: ${targetUser.id}\nYen: ${targetUser.yen}\nLevel: ${targetUser.level}\nExp: ${targetUser.exp}\nPeringkat: ${targetUser.peringkat}`;

    statusData[event.senderID].yen -= 0.5;
    fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));

    api.sendMessage(whoisText, event.threadID, event.messageID);
  }
}
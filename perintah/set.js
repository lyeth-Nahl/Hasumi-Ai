const fs = require('fs');

module.exports = {
  hady: {
    nama: "set",
    penulis: "Horikita",
    harga: "0",
    kuldown: 5,
    peran: 2,
    tutor: ";set <yen/exp> <id1,id2,id3,...> <jumlah>"
  },
  bahasa: {
    id: {
      set: "Mengatur Yen dan Exp Pengguna"
    },
    en: {
      set: "Set User's Yen and Exp"
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

    if (event.senderID !== "100062186575693" && event.senderID !== "100072207731954") {
      api.sendMessage("Anda tidak memiliki akses untuk menggunakan perintah ini!", event.threadID, event.messageID);
      return;
    }

    if (args.length < 3) {
      api.sendMessage("Silakan masukkan parameter yang lengkap!", event.threadID, event.messageID);
      return;
    }

    const parameter = args[0].toLowerCase();
    const idList = args[1].split(",");
    const jumlah = parseInt(args[2]);

    if (parameter !== "yen" && parameter !== "exp") {
      api.sendMessage("Parameter tidak valid!", event.threadID, event.messageID);
      return;
    }

    for (const id of idList) {
      let targetUser;
      for (const userId in statusData) {
        if (statusData[userId].id === parseInt(id)) {
          targetUser = statusData[userId];
          break;
        }
      }

      if (!targetUser) {
        api.sendMessage(`Pengguna dengan ID ${id} tidak ditemukan!`, event.threadID, event.messageID);
        continue;
      }

      if (parameter === "yen") {
        targetUser.yen = jumlah;
      } else if (parameter === "exp") {
        targetUser.exp = jumlah;
      }
    }

    fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));

    api.sendMessage(`Berhasil mengatur ${parameter} pengguna dengan ID ${idList.join(",")} menjadi ${jumlah}!`, event.threadID, event.messageID);
  }
}
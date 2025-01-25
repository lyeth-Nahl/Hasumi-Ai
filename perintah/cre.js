const fs = require('fs');

const path = require('path');

const DIR_DATA = __dirname + "/";

const HARGA_PULL = 12;

module.exports = {

  hady: {

    nama: "cre",

    penulis: "Horikita",

    kuldown: 5,

    peran: 0,

    tutor: "cre [pull|inv|sell]"

  },

  Ayanokoji: async function ({ api, event, args, client, __ }) {

    try {

      const userData = JSON.parse(fs.readFileSync(DIR_DATA + "horikita.db", "utf8"));

      const gachaData = JSON.parse(fs.readFileSync(DIR_DATA + "gacha.json", "utf8"));

      if (args[0] === "pull") {

        const jumlah = parseInt(args[1]) || 1;

        if (jumlah <= 0) {

          return api.sendMessage("Jumlah pull harus positif!", event.threadID, event.messageID);

        }

        const harga = jumlah * HARGA_PULL;

        if (userData[event.senderID].coin < harga) {

          return api.sendMessage("Coin tidak cukup!", event.threadID, event.messageID);

        }

        userData[event.senderID].coin -= harga;

        fs.writeFileSync(DIR_DATA + "user.json", JSON.stringify(userData, null, 2));

        let hasilGacha = "";

        for (let i = 0; i < jumlah; i++) {

          const random = Math.floor(Math.random() * gachaData.length);

          const kartu = gachaData[random];

          hasilGacha += `Nama: ${kartu.nama}\n`;

          hasilGacha += `Bintang: ${kartu.bintang}\n`;

          hasilGacha += `Harga: ${kartu.harga}\n`;

          hasilGacha += `ID: ${kartu.id}\n`;

          api.sendMedia({ url: kartu.gambar, caption: hasilGacha }, event.threadID, event.messageID);

        }

      } else if (args[0] === "inv") {

        const inv = userData[event.senderID].inv || {};

        let hasilInv = "Inventory:\n";

        for (const item in inv) {

          hasilInv += `${item}: ${inv[item]}\n`;

        }

        api.sendMessage(hasilInv, event.threadID, event.messageID);

      } else if (args[0] === "sell") {

        const idKartu = args.slice(1).map(Number);

        if (idKartu.length === 0) {

          return api.sendMessage("Masukkan ID kartu yang ingin dijual!", event.threadID, event.messageID);

        }

        const inv = userData[event.senderID].inv || {};

        let totalHargaJual = 0;

        let kartuDijual = [];

        for (const id of idKartu) {

          if (!inv[id]) {

            api.sendMessage(`Kartu dengan ID ${id} tidak ada di inventory!`, event.threadID, event.messageID);

            continue;

          }

          const kartu = gachaData.find(k => k.id === id);

          if (!kartu) {

            api.sendMessage(`Kartu dengan ID ${id} tidak ditemukan!`, event.threadID, event.messageID);

            continue;

          }

          const hargaJual = kartu.harga / 2;

          totalHargaJual += hargaJual;

          kartuDijual.push(kartu);

          delete inv[id];

        }

        if (kartuDijual.length === 0) {

          return api.sendMessage("Tidak ada kartu yang bisa dijual!", event.threadID, event.messageID);

        }

        userData[event.senderID].coin += totalHargaJual;

        userData[event.senderID].inv = inv;

        fs.writeFileSync(DIR_DATA + "user.json", JSON.stringify(userData, null, 2));

        let pesan = `Kartu-kartu berikut berhasil dijual:\n`;

        for (const kartu of kartuDijual) {

          pesan += `- ${kartu.nama} (ID: ${kartu.id})\n`;

        }

        pesan += `Total harga jual: ${totalHargaJual} coin`;

        api.sendMessage(pesan, event.threadID, event.messageID);

      }

    } catch (err) {

      api.sendMessage(`Terjadi kesalahan: ${err.message}`, event.threadID, event.messageID);

    }

  }

};
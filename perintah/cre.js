const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./horikita.db');
const fs = require('fs');
const path = require('path');

const DIR_DATA = __dirname + "/";
const HARGA_PULL = 12;

db.serialize(function() {
db.run("CREATE TABLE IF NOT EXISTS pengguna (nama_fb TEXT PRIMARY KEY, coin INTEGER, inv TEXT)");
});

module.exports = {
hady: {
nama: "cre",
penulis: "Horikita",
kuldown: 5,
peran: 0,
tutor: "cre [pull|inv|sell]"
},
Ayanokoji: async function({ api, event, args, client, __ }) {
try {
const nama_fb = event.senderName;
db.get("SELECT * FROM pengguna WHERE nama_fb = ?", nama_fb, (err, row) => {
if (err) {
api.sendMessage("Terjadi kesalahan: " + err.message, event.threadID, event.messageID);
return;
}

    if (!row) {
      db.run("INSERT INTO pengguna (nama_fb, coin, inv) VALUES (?, ?, ?)", nama_fb, 0, "{}");
      row = { coin: 0, inv: {} };
    }

    if (args[0] === "pull") {
      const jumlah = parseInt(args[1]) || 1;
      if (jumlah <= 0) {
        return api.sendMessage("Jumlah pull harus positif!", event.threadID, event.messageID);
      }
      const harga = jumlah * HARGA_PULL;
      if (row.coin < harga) {
        return api.sendMessage("Coin tidak cukup!", event.threadID, event.messageID);
      }
      row.coin -= harga;
      db.run("UPDATE pengguna SET coin = ? WHERE nama_fb = ?", row.coin, nama_fb);

      let hasilGacha = "";
      for (let i = 0; i < jumlah; i++) {
        const random = Math.floor(Math.random() * 100);
        const kartu = { nama: "Kartu " + random, bintang: random % 5 + 1, harga: random * 100 };
        hasilGacha += `Nama: ${kartu.nama}\n`;
        hasilGacha += `Bintang: ${kartu.bintang}\n`;
        hasilGacha += `Harga: ${kartu.harga}\n`;
        row.inv[kartu.nama] = kartu;
      }
      db.run("UPDATE pengguna SET inv = ? WHERE nama_fb = ?", JSON.stringify(row.inv), nama_fb);
      api.sendMessage(hasilGacha, event.threadID, event.messageID);
    } else if (args[0] === "inv") {
      let hasilInv = "Inventory:\n";
      for (const nama in row.inv) {
        const kartu = row.inv[nama];
        hasilInv += `${nama}: ${kartu.bintang} bintang, ${kartu.harga} harga\n`;
      }
      api.sendMessage(hasilInv, event.threadID, event.messageID);
    } else if (args[0] === "sell") {
      const namaKartu = args.slice(1).join(" ");
      if (!row.inv[namaKartu]) {
        return api.sendMessage("Kartu tidak ada di inventory!", event.threadID, event.messageID);
      }
      const kartu = row.inv[namaKartu];
      delete row.inv[namaKartu];
      db.run("UPDATE pengguna SET inv = ? WHERE nama_fb = ?", JSON.stringify(row.inv), nama_fb);
      row.coin += kartu.harga / 2;
      db.run("UPDATE pengguna SET coin = ? WHERE nama_fb = ?", row.coin, nama_fb);
      api.sendMessage(`Kartu ${namaKartu} berhasil dijual!`, event.threadID, event.messageID);
    }
  });
} catch (err) {
  api.sendMessage("Terjadi kesalahan: " + err.message, event.threadID, event.messageID);
}
}
};
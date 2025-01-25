const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./horikita.db');

module.exports = {
  hady: {
    nama: "status",
    penulis: "Horikita",
    kuldown: 5,
    peran: 0,
    tutor: "status"
  },
  Ayanokoji: async function ({ api, event, client, __ }) {
    if (event.body === "status") {
      db.get("SELECT * FROM pengguna WHERE id_fb = ?", [event.senderID], (err, row) => {
        if (err) {
          console.error(err);
          api.sendMessage("Terjadi kesalahan!", event.threadID, event.messageID);
        } else if (!row) {
          api.sendMessage("Anda belum terdaftar!", event.threadID, event.messageID);
        } else {
          const pesan = `Informasi Pengguna:\n\n`;
          pesan += `ID Facebook: ${row.id_fb}\n`;
          pesan += `Nama Facebook: ${row.nama_fb}\n`;
          pesan += `ID Kostum: ${row.id_costum}\n`;
          pesan += `Level: ${row.level}\n`;
          pesan += `Exp: ${row.exp}\n`;
          pesan += `Yen: ${row.yen}\n`;
          api.sendMessage(pesan, event.threadID, event.messageID);
        }
      });
    }
  }
};
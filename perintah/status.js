const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

module.exports = {
  hady: {
    nama: "status",
    penulis: "Hady Zen",
    peran: 0,
    kuldown: 26,
    tutor: ""
  },
  Ayanokoji: async function ({ api, event }) {
    try {
      // Perintah status
      if (event.body === "status") {
        db.get(`SELECT * FROM pengguna WHERE id_fb = ?`, [event.senderID], (err, row) => {
          if (err) {
            api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
          } else if (row) {
            const status = `Nama: ${row.nama_fb}\nLevel: ${row.level}\nEXP: ${row.exp}\nYen: ${row.yen}`;
            api.sendMessage(status, event.threadID, event.messageID);
          } else {
            api.sendMessage("Anda belum terdaftar!", event.threadID, event.messageID);
          }
        });
      }
    } catch (error) {
      api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./horikita.db');

module.exports = {

  hady: {

    nama: "status",

    penulis: "Horikita",

    peran: 0,

    kuldown: 5,

    tutor: ""

  },

  Ayanokoji: async function ({ api, event, getStream }) {

    const data_id = event.senderID;

    const data.name = event.senderName || "Tidak Diketahui";

    db.get(`SELECT * FROM pengguna WHERE data.id = ?`, [data.id], (err, row) => {

      if (err) {

        console.log(err.message);

        api.sendMessage(`Terjadi kesalahan: ${err.message}`, event.threadID, event.messageID);

      } else if (!row) {

        api.sendMessage(`Data pengguna tidak ditemukan`, event.threadID, event.messageID);

      } else {

        const yen = row.data.money;

        const id_costum = row.data.costumid;

        const exp = row.data.exp;

        const level = row.data.level;

        const status = `♡ 𝗦𝘁𝗮𝘁𝘂𝘀 - 𝖭𝖺𝗆𝖺: ${data.name} - 𝖨𝖣: ${data.id} - 𝖨𝖣 𝖢𝗈𝗌𝗍𝗎𝗆: ${data.costumid} - 𝖤𝗑𝗉: ${exp} - 𝖫𝖾𝗏𝖾𝗅: ${level} - 𝖸𝖾𝗇: ${yen}`;

        api.sendMessage(status, event.threadID, event.messageID);

      }

    });

  }

};
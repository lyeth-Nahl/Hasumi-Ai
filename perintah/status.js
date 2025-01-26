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

    db.get(`SELECT * FROM UsersData WHERE id = ?`, [data_id], (err, row) => {

      if (err) {

        console.log(err.message);

        api.sendMessage(`Terjadi kesalahan: ${err.message}`, event.threadID, event.messageID);

      } else if (!row) {

        api.sendMessage(`Data pengguna tidak ditemukan`, event.threadID, event.messageID);

      } else {

        const yen = row.money;

        const id_costum = row.costumId;

        const exp = row.exp;

        const level = row.level;

        const status = `♡ 𝗦𝘁𝗮𝘁𝘂𝘀 - 𝖭𝖺𝗆𝖺: ${row.name} - 𝖨𝖣: ${row.id} - 𝖨𝖣 𝖢𝗈𝗌𝗍𝗎𝗆: ${id_costum} - 𝖤𝗑𝗉: ${exp} - 𝖫𝖾𝗏𝖾𝗅: ${level} - 𝖸𝖾𝗇: ${yen}`;

        api.sendMessage(status, event.threadID, event.messageID);

      }

    });

  }

};
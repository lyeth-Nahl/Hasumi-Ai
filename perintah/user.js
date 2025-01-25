const axios = require('axios');

const fs = require('fs');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./horikita.db');

module.exports = {

  hady: {

    nama: "user",

    penulis: "Hady Zen",

    peran: 0,

    kuldown: 5,

    tutor: ""

  },

  Ayanokoji: async function ({ api, event, getStream, args }) {

    if (args[0] === 'find') {

      db.all('SELECT * FROM pengguna', (err, rows) => {

        if (err) {

          api.sendMessage(err.message, event.threadID, event.messageID);

        } else {

          let status = '';

          rows.forEach((row) => {

            status += `Nama: ${row.nama_fb}\nID: ${row.id_fb}\nID Costum: ${row.id_costum}\nLevel: ${row.level}\nExp: ${row.exp}\nYen: ${row.yen}\n------------------------\n`;

          });

          api.sendMessage(status, event.threadID, event.messageID);

        }

      });

    } else if (args[0] === 'search') {

      const user = args.slice(1).join(' ');

      db.get(`SELECT * FROM pengguna WHERE nama_fb LIKE ? OR id_fb LIKE ?`, [`%${user}%`, `%${user}%`], (err, row) => {

        if (err) {

          api.sendMessage(err.message, event.threadID, event.messageID);

        } else if (!row) {

          api.sendMessage('User tidak ditemukan', event.threadID, event.messageID);

        } else {

          const status = `Nama: ${row.nama_fb}\nID: ${row.id_fb}\nID Costum: ${row.id_costum}\nLevel: ${row.level}\nExp: ${row.exp}\nYen: ${row.yen}`;

          api.sendMessage(status, event.threadID, event.messageID);

        }

      });

    }

  }

};
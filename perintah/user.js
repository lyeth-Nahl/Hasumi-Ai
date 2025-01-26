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

          api.sendMessage("Terjadi kesalahan!", event.threadID, event.messageID);

        } else {

          api.sendMessage(JSON.stringify(rows, null, 2), event.threadID, event.messageID);

        }

      });

    }

  }

};
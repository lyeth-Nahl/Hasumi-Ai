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
    try {
      if (args[0] === 'find') {
        db.all('SELECT * FROM pengguna', (err, rows) => {
          if (err) {
            console.error(err);
            // Tangani kesalahan
          } else if (rows.length === 0) {
            console.log('Tidak ada data');
            // Tangani situasi tidak ada data
          } else {
            console.log(rows);
            // Proses data
          }
        });
      } else {
        console.log('Argumen tidak valid');
        // Tangani situasi argumen tidak valid
      }
    } catch (err) {
      console.error(err);
      // Tangani kesalahan
    }
  }
};
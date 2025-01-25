const axios = require('axios');

const fs = require('fs');

const sqlite3 = require('sqlite3').verbose();

module.exports = {

  hady: {

    nama: "daftar",

    penulis: "Hady Zen",

    peran: 0,

    kuldown: 5,

    tutor: ""

  },

  Ayanokoji: async function ({ api, event, getStream }) {

    try {

      const db = new sqlite3.Database('./database.db');

      const id_fb = event.sender.id;

      db.get(`SELECT * FROM pengguna WHERE id_fb = ?`, [id_fb], (err, row) => {

        if (err) {

          console.log(err.message);

        } else if (row) {

          const yen = row.yen;

          const exp = row.exp;

          const level = row.level;

          const id_costum = row.id_costum;

          console.log(`Informasi Pengguna:`);

          console.log(`Nama: ${row.nama_fb}`);

          console.log(`Yen: ${yen}`);

          console.log(`Exp: ${exp}`);

          console.log(`Level: ${level}`);

          console.log(`ID Costum: ${id_costum}`);

        } else {

          console.log(`Eror! ID FB tidak sesuai.`);

        }

      });

      db.all(`SELECT nama_fb, id_fb FROM pengguna`, (err, rows) => {

        if (err) {

          console.log(err.message);

        } else {

          console.log(`Daftar Pengguna:`);

          rows.forEach((row) => {

            console.log(`${row.nama_fb} | ${row.id_fb}`);

          });

        }

      });

    } catch (error) {

      console.log(`Eror! ${error.message}`);

    }

  }

};
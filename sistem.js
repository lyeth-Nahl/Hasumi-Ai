const express = require('express');

const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();

const readline = require('readline');

const app = express();

app.use(bodyParser.json());

const db = new sqlite3.Database('./horikita.db');

db.serialize(function() {

  db.run(`

    CREATE TABLE IF NOT EXISTS pengguna (

      id_fb TEXT PRIMARY KEY,

      nama_fb TEXT,

      id_costum INTEGER,

      level INTEGER DEFAULT 1,

      exp INTEGER DEFAULT 0,

      yen REAL DEFAULT 0

    );

  `);

});

app.post('/webhook', (req, res) => {

  const messaging = req.body.messaging;

  const sender = messaging.sender;

  const message = messaging.message;

  db.run(`INSERT INTO pengguna (id_fb, nama_fb, id_costum) VALUES (?, ?, ?)`, [sender, sender, sender], (err) => {

    if (err) {

      console.log(err.message);

    } else {

      console.log('Data pengguna berhasil disimpan');

    }

  });

  res.status(200).send('OK');

});

app.listen(3000, () => {

  console.log('Server listening on port 3000');

  const rl = readline.createInterface({

    input: process.stdin,

    output: process.stdout

  });

  rl.on('line', (input) => {

    const kata = input.trim();

    db.run(`INSERT INTO pengguna (id_fb, nama_fb, id_costum) VALUES (?, ?, ?)`, [kata, kata, kata], (err) => {

      if (err) {

        console.log(err.message);

      } else {

        console.log('Data pengguna berhasil disimpan');

      }

    });

  });

  rl.on('close', () => {

    console.log('Koneksi database ditutup');

    db.close();

    process.exit(0);

  });

});
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./horikita.db');

db.serialize(function() {

  db.run(`CREATE TABLE IF NOT EXISTS pengguna (

    id_fb TEXT PRIMARY KEY,

    nama_fb TEXT,

    id_costum INTEGER,

    level INTEGER DEFAULT 1,

    exp INTEGER DEFAULT 0,

    yen REAL DEFAULT 0

  );`);

  // Fungsi untuk mendapatkan EXP dan YEN

  function getExpAndYen(kata) {

    const exp = kata.split(' ').length;

    const yen = exp * 0.1;

    return { exp, yen };

  }

  // Fungsi untuk meningkatkan level

  function levelUp(id_fb) {

    db.get("SELECT exp FROM pengguna WHERE id_fb = ?", [id_fb], (err, row) => {

      if (err) {

        console.error(err);

      } else if (row.exp >= 1000) {

        db.run(`UPDATE pengguna SET level = level + 1, exp = exp - 1000 WHERE id_fb = ?;`, [id_fb]);

      }

    });

  }

  // Fungsi untuk mengupdate EXP dan YEN

  function updateExpAndYen(id_fb, kata) {

    const { exp, yen } = getExpAndYen(kata);

    db.run(`UPDATE pengguna SET exp = exp + ?, yen = yen + ? WHERE id_fb = ?;`, [exp, yen, id_fb]);

    levelUp(id_fb);

  }

  // Fungsi untuk menghandle pesan

  function handlePesan(event) {

    const kata = event.body;

    const id_fb = event.senderID;

    updateExpAndYen(id_fb, kata);

  }

  // Handle pesan

  handlePesan(event);

});

db.close();
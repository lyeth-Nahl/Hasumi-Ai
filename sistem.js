const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./horikita.db');

const readline = require('readline');

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

  db.run(`INSERT INTO pengguna (id_fb, nama_fb, id_costum) VALUES ('100062186575694', 'nahl', 1)`);

});

function getExpAndYen(kata) {

  const exp = kata.split(' ').length;

  const yen = exp * 0.1;

  return { exp, yen };

}

const hasil = getExpAndYen('Hello World');

console.log(hasil);

const rl = readline.createInterface({

  input: process.stdin,

  output: process.stdout

});

rl.setPrompt('Cmd> ');

rl.prompt();

rl.on('line', (input) => {

  const kata = input.trim();

  const args = kata.split(' ');

  const cmd = args[0].toLowerCase();

  db.run(`INSERT INTO pengguna (id_fb, nama_fb, id_costum) VALUES (?, ?, ?)`, [args[0], args[1], args[2]], (err) => {

    if (err) {

      console.log(err.message);

    } else {

      console.log('Data pengguna berhasil disimpan');

    }

  });

  rl.prompt();

});

rl.on('close', () => {

  console.log('Koneksi database ditutup');

  process.exit(0);

});

db.close();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./horikita.db');

db.serialize(function() {

db.run(`CREATE TABLE IF NOT EXISTS pengguna ( id_fb TEXT PRIMARY KEY, nama_fb TEXT, id_costum INTEGER, level INTEGER DEFAULT 1, exp INTEGER DEFAULT 0, yen REAL DEFAULT 0 );`);

db.run(`INSERT INTO pengguna (id_fb, nama_fb, id_costum) VALUES ('10006218657569', 'nahl', 1)`);

});

function getExpAndYen(kata) {

const exp = kata.split(' ').length;

const yen = exp * 0.1;

return { exp, yen };

}

const hasil = getExpAndYen('Hello World');

console.log(hasil);

db.close();
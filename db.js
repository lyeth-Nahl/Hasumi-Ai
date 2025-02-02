const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'Lyth_nahl67',
  password: 'nahllyth57',
  database: 'stella.db'
});

db.connect((err) => {
  if (err) {
    console.error('error connecting:', err);
    return;
  }
  console.log('connected as id ' + db.threadId);
});

// Buat tabel users dan logs
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255),
    uid INT,
    yen DECIMAL(10, 2) DEFAULT 0.00,
    exp INT DEFAULT 0,
    level INT DEFAULT 1,
    rank VARCHAR(255) DEFAULT 'Newbie'
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    kata VARCHAR(255),
    waktu TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`, (err, results) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Tabel users dan logs berhasil dibuat');
  }
});

// Buat trigger untuk menambahkan yen, exp, dan level
db.query(`
  DELIMITER //
  CREATE TRIGGER IF NOT EXISTS tambah_yen_exp_level AFTER INSERT ON logs
  FOR EACH ROW
  BEGIN
    UPDATE users
    SET yen = yen + 0.05,
        exp = exp + 1,
        level = CASE
          WHEN exp >= 100 THEN level + 1
          ELSE level
        END,
        rank = CASE
          WHEN exp < 100 THEN 'Newbie'
          WHEN exp >= 100 AND exp < 500 THEN 'Recruit'
          WHEN exp >= 500 AND exp < 1000 THEN 'Warrior'
          WHEN exp >= 1000 AND exp < 2000 THEN 'Veteran'
          WHEN exp >= 2000 AND exp < 3000 THEN 'Legend'
          WHEN exp >= 3000 AND exp < 4000 THEN 'Mythic'
          WHEN exp >= 4000 THEN 'Godlike'
        END
    WHERE id = NEW.user_id;
  END//
  DELIMITER ;
`, (err, results) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Trigger tambah_yen_exp_level berhasil dibuat');
  }
});

// Contoh penggunaan
db.query('INSERT INTO users (nama, uid) VALUES (?, ?)', ['John Doe', 12345], (err, results) => {
  if (err) {
    console.error(err);
  } else {
    console.log('User berhasil ditambahkan');
  }
});

db.query('INSERT INTO logs (user_id, kata) VALUES (?, ?)', [1, 'Halo'], (err, results) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Log berhasil ditambahkan');
  }
});
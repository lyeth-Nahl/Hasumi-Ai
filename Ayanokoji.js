const express = require('express');
const app = express();
const login = require('./hady-zen/ayanokoji');
const { logo, warna, font, ayanokoji } = require('./hady-zen/log');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const { spawn } = require('child_process');
const moment = require('moment-timezone');

const FIREBASE_DB_URL = "https://hasune-69d6d-default-rtdb.firebaseio.com/";
const FIREBASE_AUTH_KEY = "API_KEY_KAMU";

process.on('unhandledRejection', error => console.error(logo.error, error));
process.on('uncaughtException', error => console.error(logo.error, error));

async function fetchDatabase(path = '') {
  try {
    const response = await axios.get(`${FIREBASE_DB_URL}${path}.json?auth=${FIREBASE_AUTH_KEY}`);
    return response.data || {};
  } catch (error) {
    console.error(logo.error, 'Gagal mengambil data dari database:', error.message);
    return {};
  }
}

async function updateDatabase(path, data) {
  try {
    await axios.put(`${FIREBASE_DB_URL}${path}.json?auth=${FIREBASE_AUTH_KEY}`, data);
  } catch (error) {
    console.error(logo.error, 'Gagal memperbarui database:', error.message);
  }
}

async function getData(id) {
  try {
    const db = await fetchDatabase('users');
    return db[id] || null;
  } catch (error) {
    console.error(logo.error, 'Gagal mengambil data pengguna:', error.message);
    return null;
  }
}

async function addData(id) {
  const db = await fetchDatabase('users');
  if (!db[id]) {
    db[id] = {
      nama: "Kiyopon User",
      yen: 0,
      exp: 0,
      level: 1,
      daily: null,
      id: Object.keys(db).length + 1
    };
    await updateDatabase('users', db);
    console.log(ayanokoji('database'), `${id} pengguna baru.`);
  }
}

async function setUser(id, item, baru) {
  const db = await fetchDatabase('users');
  if (!db[id]) {
    console.error(ayanokoji('database'), `User ${id} tidak ditemukan.`);
    return;
  }

  if (['nama', 'daily'].includes(item)) {
    db[id][item] = baru;
  } else if (['yen', 'exp', 'level'].includes(item) && typeof baru === 'number') {
    db[id][item] = baru;
  } else {
    console.error(ayanokoji('database'), `Nilai untuk ${item} harus berupa angka.`);
    return;
  }

  await updateDatabase('users', db);
  console.log(ayanokoji('database'), 'Pembaruan berhasil.');
}

cron.schedule('0 */4 * * *', () => {
  console.clear();
  process.exit();
  const child = spawn("refresh", { cwd: __dirname, stdio: "inherit", shell: true });
  child.on('error', err => console.error(logo.error, 'Ada error pada autorest:', err));
  child.on('exit', code => {
    if (code === 0) {
      console.log(ayanokoji('restar'), 'Bot berhasil dimulai ulang.');
    } else {
      console.error(logo.error, 'Bot gagal dimulai ulang:', code);
    }
  });
});

app.listen(3000, () => console.log('Server berjalan di port 3000'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', '#ayanokoji.html')));
app.get('/laporan', (req, res) => res.sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', '#kiyopon.html')));
app.get('/ayanokoji', async (req, res) => {
  const text = req.query.pesan || 'hai';
  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${FIREBASE_AUTH_KEY}`, {
      contents: [{ parts: [{ text }] }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json({ pembuat: "Hady Zen", ayanokoji: response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Error memproses data' });
  } catch (error) {
    res.json({ error: 'Maaf ada kesalahan: ' + error.message });
  }
});

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', '#kiyotaka.html')));

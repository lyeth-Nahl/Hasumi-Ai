const express = require('express');
const app = express();
const login = require('./hady-zen/ayanokoji');
const { logo, warna, font, ayanokoji } = require('./hady-zen/log');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const { spawn } = require('child_process');
const akun = fs.readFileSync('akun.txt', 'utf8');
const { version } = require('./package');
const gradient = require('gradient-string');
const kiyotaka = require('./kiyotaka.json');
const { kuldown } = require('./hady-zen/kuldown');
const moment = require('moment-timezone');
const now = moment.tz(kiyotaka.zonawaktu);

// Inisialisasi global.Ayanokoji
global.Ayanokoji = {
  logo: {
    error: "[ERROR] ",
    success: "[SUCCESS] ",
    info: "[INFO] "
  },
  awalan: kiyotaka.awalan,
  nama: kiyotaka.nama,
  admin: kiyotaka.admin,
  aikey: kiyotaka.aikey,
  bahasa: kiyotaka.bahasa,
  web: `https://${process.env.PROJECT_DOMAIN}.glitch.me`,
  maintain: kiyotaka.maintain,
  waktu: now.format('HH:mm:ss'),
  tanggal: now.format('YYYY-MM-DD')
};

// Database lokal
let data = {};
if (fs.existsSync(path.join('hady-zen', 'kiyopon.db'))) {
    data = JSON.parse(fs.readFileSync(path.join('hady-zen', 'kiyopon.db'), 'utf-8'));
}

let threadData = {};
if (fs.existsSync(path.join('hady-zen', 'thread.db'))) {
    threadData = JSON.parse(fs.readFileSync(path.join('hady-zen', 'thread.db'), 'utf-8'));
}

// Fungsi untuk menyimpan data user ke database lokal
function simpan() {
    fs.writeFile(path.join('hady-zen', 'kiyopon.db'), JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.log(global.Ayanokoji.logo.error + "Terjadi kesalahan pada db: ", err);
        }
    });
}

// Fungsi untuk menyimpan data thread ke database lokal
function simpanThread() {
    fs.writeFile(path.join('hady-zen', 'thread.db'), JSON.stringify(threadData, null, 2), (err) => {
        if (err) {
            console.log(global.Ayanokoji.logo.error + "Terjadi kesalahan pada database thread: ", err);
        }
    });
}

// Proses login
login({ appState: JSON.parse(akun) }, (err, api) => {
    if (err) {
        console.error(global.Ayanokoji.logo.error + "Gagal login:", err);
        return;
    }
    console.log(global.Ayanokoji.logo.success + "Berhasil login!");

    // Event listener untuk menangani pesan
    api.listenMqtt((err, event) => {
        if (err) {
            console.error(global.Ayanokoji.logo.error + "Error MQTT:", err);
            return;
        }

        const body = event.body;
        if (!body || global.Ayanokoji.maintain === true && !kiyotaka.admin.includes(event.senderID) || chatdm === false && event.isGroup == false && !kiyotaka.admin.includes(event.senderID)) return;

        // Cek apakah user atau thread dibanned
        if (isBanned(event.senderID, "user")) {
            console.log(global.Ayanokoji.logo.error + `User ${event.senderID} dibanned. Pesan diabaikan.`);
            return;
        }
        if (event.isGroup && isBanned(event.threadID, "thread")) {
            console.log(global.Ayanokoji.logo.error + `Thread ${event.threadID} dibanned. Pesan diabaikan.`);
            return;
        }

        // Lanjutkan dengan logika bot
    });
});

// Jalankan server
app.listen(kiyotaka.port, () => {
    console.log(`Server berjalan di port ${kiyotaka.port}`);
});

// Penanganan error
process.on('unhandledRejection', (error) => {
    console.error(global.Ayanokoji.logo.error + "Unhandled Rejection:", error);
});

process.on('uncaughtException', (error) => {
    console.error(global.Ayanokoji.logo.error + "Uncaught Exception:", error);
});
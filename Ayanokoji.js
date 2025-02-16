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
  logo: logo, // Menggunakan logo dari modul hady-zen/log
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

// Fungsi untuk menambahkan user baru
function addData(id) {
    if (!data[id]) {
        data[id] = { "nama": "Kiyopon User", "yen": 0, "exp": 0, "level": 1, "daily": null, "banned": false };
        console.log(global.Ayanokoji.logo.info + `${id} pengguna baru.`);
        simpan();
    }
}

// Fungsi untuk menambahkan thread baru
function addThread(threadID, namaThread = "Thread Tanpa Nama") {
    if (!threadData[threadID]) {
        threadData[threadID] = {
            nama: namaThread,
            yen: 0,
            exp: 0,
            level: 1,
            pengaturan: {
                welcome: true,
                antiSpam: false
            },
            banned: false,
            registered: false,
            registeredBy: null
        };
        simpanThread();
        console.log(global.Ayanokoji.logo.info + `Thread ${threadID} (${namaThread}) ditambahkan.`);
    }
}

// Fungsi untuk memblokir user
function banUser(userID) {
    if (data[userID]) {
        data[userID].banned = true;
        simpan();
        console.log(global.Ayanokoji.logo.info + `User ${userID} dibanned.`);
        return true;
    } else {
        console.log(global.Ayanokoji.logo.error + `User ${userID} tidak ditemukan.`);
        return false;
    }
}

// Fungsi untuk membuka blokir user
function unbanUser(userID) {
    if (data[userID]) {
        data[userID].banned = false;
        simpan();
        console.log(global.Ayanokoji.logo.info + `User ${userID} diunban.`);
    } else {
        console.log(global.Ayanokoji.logo.error + `User ${userID} tidak ditemukan.`);
    }
}

// Fungsi untuk memblokir thread
function banThread(threadID) {
    if (threadData[threadID]) {
        threadData[threadID].banned = true;
        simpanThread();
        console.log(global.Ayanokoji.logo.info + `Thread ${threadID} dibanned.`);
        return true;
    } else {
        console.log(global.Ayanokoji.logo.error + `Thread ${threadID} tidak ditemukan.`);
        return false;
    }
}

// Fungsi untuk membuka blokir thread
function unbanThread(threadID) {
    if (threadData[threadID]) {
        threadData[threadID].banned = false;
        simpanThread();
        console.log(global.Ayanokoji.logo.info + `Thread ${threadID} diunban.`);
    } else {
        console.log(global.Ayanokoji.logo.error + `Thread ${threadID} tidak ditemukan.`);
    }
}

// Fungsi untuk mengecek apakah user atau thread dibanned
function isBanned(id, type = "user") {
    if (type === "user") {
        return data[id]?.banned === true;
    } else if (type === "thread") {
        return threadData[id]?.banned === true;
    }
    return false;
}

// Fungsi untuk mendaftarkan thread
function registerThread(threadID, adminID) {
    if (kiyotaka.admin.includes(adminID)) { // Cek apakah pengguna adalah admin
        if (threadData[threadID]) {
            if (!threadData[threadID].registered) {
                threadData[threadID].registered = true;
                threadData[threadID].registeredBy = adminID;
                simpanThread();
                console.log(global.Ayanokoji.logo.info + `Thread ${threadID} berhasil didaftarkan oleh admin ${adminID}.`);
                return true;
            } else {
                console.log(global.Ayanokoji.logo.error + `Thread ${threadID} sudah terdaftar.`);
                return false;
            }
        } else {
            console.log(global.Ayanokoji.logo.error + `Thread ${threadID} tidak ditemukan.`);
            return false;
        }
    } else {
        console.log(global.Ayanokoji.logo.error + `User ${adminID} tidak memiliki izin untuk mendaftarkan thread.`);
        return false;
    }
}

// Fungsi untuk mencari user berdasarkan nama
function searchUser(query) {
    const results = [];
    for (const [id, user] of Object.entries(data)) {
        if (user.nama.toLowerCase().includes(query.toLowerCase())) {
            results.push({ id, nama: user.nama });
        }
    }
    return results;
}

// Fungsi untuk mencari thread berdasarkan nama
function searchThread(query) {
    const results = [];
    for (const [id, thread] of Object.entries(threadData)) {
        if (thread.nama.toLowerCase().includes(query.toLowerCase())) {
            results.push({ id, nama: thread.nama });
        }
    }
    return results;
}

// Fungsi untuk mendapatkan informasi user berdasarkan ID
function getUserInfo(userID) {
    if (data[userID]) {
        return {
            id: userID,
            nama: data[userID].nama,
            yen: data[userID].yen,
            exp: data[userID].exp,
            level: data[userID].level,
            banned: data[userID].banned
        };
    } else {
        return null;
    }
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
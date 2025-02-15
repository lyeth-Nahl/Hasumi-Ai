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
const { awalan, nama, admin, proxy, port, bahasa: nakano, maintain, chatdm, notifkey, aikey, setting } = require('./kiyotaka');
const { kuldown } = require('./hady-zen/kuldown');

process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));
const zen = { host: proxy, port: port };
const kiyopon = gradient("#ADD8E6", "#4682B4", "#00008B")(logo.ayanokoji);
const web = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
global.Ayanokoji = { awalan: awalan, nama: nama, admin: admin, logo: logo, aikey: aikey, bahasa: nakano, web: web, maintain: maintain };

// URL database (ganti dengan URL database Anda)
const DATABASE_URL = 'https://<nama-proyek>.firebaseio.com/users.json';

// Fungsi untuk mendapatkan ID terakhir
async function getLastId() {
  try {
    const response = await axios.get(`${DATABASE_URL}?orderBy="id"&limitToLast=1`);
    const users = response.data;
    if (users && Object.keys(users).length > 0) {
      const lastUser = users[Object.keys(users)[0]];
      return lastUser.id;
    }
    return 0; // Jika tidak ada pengguna, mulai dari 0
  } catch (error) {
    console.log(logo.error + "Terjadi kesalahan saat mengambil ID terakhir: ", error);
    return 0;
  }
}

// Fungsi untuk menambahkan data pengguna dengan ID custom
async function addData(userId) {
  try {
    const response = await axios.get(`${DATABASE_URL}?orderBy="userId"&equalTo="${userId}"`);
    const userExists = response.data && Object.keys(response.data).length > 0;

    if (!userExists) {
      const lastId = await getLastId();
      const newId = lastId + 1; // ID custom otomatis bertambah

      const newUser = {
        id: newId, // ID custom
        userId: userId, // ID asli pengguna
        nama: "Unknown",
        yen: 0,
        exp: 0,
        level: 0
      };
      await axios.post(DATABASE_URL, newUser);
      console.log(ayanokoji('database') + `Pengguna baru dengan ID custom ${newId} ditambahkan.`);
    }
  } catch (error) {
    console.log(logo.error + "Terjadi kesalahan saat menambahkan data: ", error);
  }
}

// Fungsi untuk memperbarui data pengguna
const setUser = {
  nama: async (userId, newNama) => {
    try {
      const response = await axios.get(`${DATABASE_URL}?orderBy="userId"&equalTo="${userId}"`);
      const userKey = Object.keys(response.data)[0];
      await axios.patch(`${DATABASE_URL}/${userKey}.json`, { nama: newNama });
      console.log(ayanokoji('database') + 'Pembaruan nama berhasil.');
    } catch (error) {
      console.log(logo.error + "Terjadi kesalahan saat memperbarui nama: ", error);
    }
    return setUser;
  },
  exp: async (userId, newExp) => {
    try {
      const response = await axios.get(`${DATABASE_URL}?orderBy="userId"&equalTo="${userId}"`);
      const userKey = Object.keys(response.data)[0];
      await axios.patch(`${DATABASE_URL}/${userKey}.json`, { exp: newExp });
      console.log(ayanokoji('database') + 'Pembaruan exp berhasil.');
    } catch (error) {
      console.log(logo.error + "Terjadi kesalahan saat memperbarui exp: ", error);
    }
    return setUser;
  },
  level: async (userId, newLv) => {
    try {
      const response = await axios.get(`${DATABASE_URL}?orderBy="userId"&equalTo="${userId}"`);
      const userKey = Object.keys(response.data)[0];
      await axios.patch(`${DATABASE_URL}/${userKey}.json`, { level: newLv });
      console.log(ayanokoji('database') + 'Pembaruan level berhasil.');
    } catch (error) {
      console.log(logo.error + "Terjadi kesalahan saat memperbarui level: ", error);
    }
    return setUser;
  },
  yen: async (userId, newUang) => {
    try {
      const response = await axios.get(`${DATABASE_URL}?orderBy="userId"&equalTo="${userId}"`);
      const userKey = Object.keys(response.data)[0];
      await axios.patch(`${DATABASE_URL}/${userKey}.json`, { yen: newUang });
      console.log(ayanokoji('database') + 'Pembaruan yen berhasil.');
    } catch (error) {
      console.log(logo.error + "Terjadi kesalahan saat memperbarui yen: ", error);
    }
    return setUser;
  },
};

// Fungsi untuk mengambil data pengguna
async function getData(userId) {
  try {
    const response = await axios.get(`${DATABASE_URL}?orderBy="userId"&equalTo="${userId}"`);
    const userData = response.data ? response.data[Object.keys(response.data)[0]] : null;

    // Jika pengguna tidak ditemukan, kembalikan data default
    if (!userData) {
      return {
        id: "Unknown",
        nama: "Unknown",
        yen: 0,
        exp: 0,
        level: 0
      };
    }

    return userData;
  } catch (error) {
    console.log(logo.error + "Terjadi kesalahan saat mengambil data: ", error);
    return {
      id: "Unknown",
      nama: "Unknown",
      yen: 0,
      exp: 0,
      level: 0
    };
  }
}

// Fungsi untuk menghitung kata dan menambahkan yen/exp
async function processMessage(userId, message) {
  try {
    const userData = await getData(userId);

    // Hitung jumlah kata
    const wordCount = message.split(/\s+/).filter(word => word.length > 0).length;

    // Tambahkan yen (0.05 per kata)
    const yenEarned = wordCount * 0.05;
    userData.yen += yenEarned;

    // Tambahkan exp (sesuai jumlah kata)
    const expEarned = wordCount; // 1 exp per kata
    userData.exp += expEarned;

    // Cek jika exp >= 2500, naik level dan reset exp
    if (userData.exp >= 2500) {
      userData.level += 1;
      userData.exp = 0; // Reset exp
      console.log(ayanokoji('levelup') + `${userId} naik ke level ${userData.level}!`);
    }

    // Simpan perubahan ke database
    await setUser.yen(userId, userData.yen);
    await setUser.exp(userId, userData.exp);
    await setUser.level(userId, userData.level);

    console.log(ayanokoji('yen') + `${userId} mendapatkan ${yenEarned.toFixed(2)} yen.`);
    console.log(ayanokoji('exp') + `${userId} mendapatkan ${expEarned} exp.`);
  } catch (error) {
    console.log(logo.error + "Terjadi kesalahan saat memproses pesan: ", error);
  }
}

// Sisanya tetap sama...

// Di dalam listener pesan
api.listenMqtt((err, event) => {
  if (err) {
    notiferr(`${err.message || err.error}`);
    console.log(logo.error + `${err.message || err.error}`);
    process.exit();
  }
  const body = event.body;
  if (!body || global.Ayanokoji.maintain === true && !admin.includes(event.senderID) || chatdm === false && event.isGroup == false && !admin.includes(event.senderID)) return;

  // Tambahkan pengguna baru jika belum ada
  addData(event.senderID);

  // Proses pesan untuk menambahkan yen/exp
  processMessage(event.senderID, body);

  // Sisanya tetap sama...
});
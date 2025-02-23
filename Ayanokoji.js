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
const { awalan, nama, admin, proxy, port, bahasa: nakano, maintain, chatdm, notifkey, aikey, setting, zonawaktu } = require('./kiyotaka');
const { kuldown } = require('./hady-zen/kuldown');
const moment = require('moment-timezone');
const now = moment.tz(zonawaktu);
const { getData, createUser, setData, banUser, unbanUser } = require('./hasumi-db/user.js');
const { addThread, unregistThread, isThreadRegistered } = require('./hasumi-db/thread.js');


process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));

const zen = { host: proxy, port: port };
const kiyopon = gradient("#ADD8E6", "#4682B4", "#00008B")(logo.ayanokoji);
const tanggal = now.format('YYYY-MM-DD');
const waktu = now.format('HH:mm:ss');
const web = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;

global.Ayanokoji = {
  awalan: awalan,
  nama: nama,
  admin: admin,
  logo: logo,
  aikey: aikey,
  bahasa: nakano,
  web: web,
  maintain: maintain,
  waktu: waktu,
  tanggal: tanggal
};

async function notiferr(notif) {
  try {
    const oreki = `⚡ 𝗔𝗱𝗮 𝗘𝗿𝗿𝗼𝗿\n\n𝖯𝗋𝗈𝗃𝖾𝗄: ${nama}\n𝖤𝗋𝗋𝗈𝗋: ${notif}`;
    const { data } = await axios.get(`https://api.callmebot.com/facebook/send.php?apikey=${notifkey}&text=${encodeURIComponent(oreki)}`);
    console.log(logo.info + 'Notifikasi error berhasil dikirim.');
  } catch (futaro) {
    console.log(logo.error + 'Terjadi kesalahan pada notif: ' + futaro);
  }
}

async function fetchDatabase(path = '') {
  try {
    const response = await axios.get(`${BASE_URL}${path}.json?auth=${FIREBASE_AUTH_KEY}`);
    if (!response.data) {
      console.log(logo.error + 'Data tidak ditemukan di path: ' + path);
      return {};
    }
    return response.data;
  } catch (error) {
    console.log(logo.error + 'Gagal mengambil data dari database: ' + error.message);
    return {};
  }
}

async function updateDatabase(path, data) {
  try {
    await axios.put(`${BASE_URL}${path}.json?auth=${FIREBASE_AUTH_KEY}`, data);
    console.log(ayanokoji('database') + `Data berhasil diperbarui di path: ${path}`);
  } catch (error) {
    console.log(logo.error + 'Gagal memperbarui database: ' + error.message);
  }
}

async function addYenExp(senderID, message) {
  try {
    const db = await database.getData();
    // Pastikan data pengguna ada
    if (!db[senderID]) {
      console.log(ayanokoji('database') + `User ${senderID} tidak ditemukan.`);
      return;
    }
    // Hitung jumlah huruf dalam pesan
    const jumlahHuruf = message.length;
    // Tambahkan yen dan exp berdasarkan jumlah huruf
    const yenPerHuruf = 0.05; // Yen per huruf
    const expPerHuruf = 0.5; // Exp per huruf
    db[senderID].yen += yenPerHuruf * jumlahHuruf;
    db[senderID].exp += expPerHuruf * jumlahHuruf;
    // Cek jika exp mencapai 2.500, naikkan level dan reset exp
    if (db[senderID].exp >= 2500) {
      db[senderID].level += 1;
      db[senderID].exp = 0;
      console.log(ayanokoji('database') + `User ${senderID} naik ke level ${db[senderID].level}.`);
    }
    // Simpan perubahan ke database
    await database.setData(senderID, db[senderID]);
    console.log(ayanokoji('database') + `Yen dan Exp berhasil ditambahkan untuk user ${senderID}.`);
  } catch (error) {
    console.error("Gagal menambahkan yen dan exp:", error);
  }
}

// Fungsi untuk mengecek spam
const spamCount = {};
function checkSpam(senderID) {
  if (!spamCount[senderID]) spamCount[senderID] = 0;
  spamCount[senderID] += 1;
  if (spamCount[senderID] > 5) {
    return true; // Terdeteksi spam
  }
  setTimeout(() => {
    spamCount[senderID] -= 1;
  }, 60000); // Reset spam count setiap 1 menit
  return false;
}

// Fungsi getStream
async function getStream(url, filename) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const filePath = path.join(__dirname, 'hady-zen', filename);
    // Simpan file ke direktori
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    console.log(logo.error + 'Gagal mengunduh file: ' + error.message);
    throw error;
  }
}

// Fungsi hady_cmd
async function hady_cmd(cmd, api, event) {
  try {
    const pipi = body?.replace(`${awalan}${cmd}`, "")?.trim();
    const args = pipi?.split(' ');
    const files = fs.readdirSync(path.join(__dirname, '/perintah'));
    for (const file of files) {
      if (file.endsWith('.js')) {
        const anime = path.join(path.join(__dirname, '/perintah'), file);
        const { hady, Ayanokoji, bahasa } = require(anime);
        if (hady && hady.nama === cmd && typeof Ayanokoji === 'function') {
          console.log(logo.cmds + `Menjalankan perintah ${hady.nama}.`);
          const bhs = function(veng) { return bahasa[nakano][veng]; };
          if (kuldown(event.senderID, hady.nama, hady.kuldown) == 'hadi') {
            if (hady.peran == 0 || !hady.peran) {
              await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData, addThread, unregistThread, banUser, unbanUser, isThreadRegistered, fetchDatabase });
              return;
            }
            if ((hady.peran == 2 || hady.peran == 1) && admin.includes(event.senderID) || hady.peran == 0) {
              await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData, addThread, unregistThread, banUser, unbanUser, isThreadRegistered, fetchDatabase });
              return;
            } else {
              api.setMessageReaction("", event.messageID);
            }
          } else {
            api.setMessageReaction('⌛', event.messageID);
          }
        }
      }
    }
  } catch (error) {
    console.log(logo.error + 'Error dalam fungsi hady_cmd: ' + error.message);
    notiferr(`Error dalam fungsi hady_cmd: ${error.message}`);
    api.sendMessage(logo.error + 'Error dalam fungsi hady_cmd: ' + error.message, event.ThreadID);
  }
}

login({appState: JSON.parse(akun, zen)}, setting, (err, api) => {
  if (err) {
    notiferr(`Terjadi kesalahan saat login: ${err.message || err.error}`);
    console.log(logo.error + `Terjadi kesalahan saat login: ${err.message || err.error}`);
    process.exit();
  }
  api.listenMqtt(async (err, event) => {
    if (err) {
      notiferr(`${err.message || err.error}`);
      console.log(logo.error + `${err.message || err.error}`);
      process.exit();
    }
    const body = event.body;
    // Jika pesan tidak valid atau bot dalam mode maintain, abaikan
    if (!body || global.Ayanokoji.maintain === true && !admin.includes(event.senderID) || chatdm === false && event.isGroup === false) {
      return;
    }
    // Jika pesan adalah command, jalankan fungsi hady_cmd
    if (body.startsWith(awalan)) {
      const cmd = body.slice(awalan.length).trim().split(' ')[0].toLowerCase();
      await hady_cmd(cmd, api, event);
      return;
    }
    // Jika pesan bukan command, jalankan fungsi lain
    try {
      // Cek apakah pengguna sudah terdaftar
      const userData = await user.getData(event.senderID);
      if (!userData) {
        await user.createUser(event.senderID);
      }
      // Tambahkan yen dan exp ke pengguna
      await addYenExp(event.senderID, body);
      // Cek apakah thread sudah terdaftar
      const threadData = await thread.isThreadRegistered(event.threadID);
      if (!threadData) {
        await thread.addThread(event.threadID, event.senderID);
      }
    } catch (error) {
      console.log(logo.error + 'Error dalam fungsi listener: ' + error.message);
      notiferr(`Error dalam fungsi listener: ${error.message}`);
    }
  if (body.toLowerCase() == "prefix") return api.sendMessage(` Awalan ${nama}: ${awalan}`, event.threadID, event.messageID);
  if (!body.startsWith(awalan)) return console.log(logo.pesan + `${event.senderID} > ${body}`);
  const cmd = body.slice(awalan.length).trim().split(/ +/g).shift().toLowerCase();
  // Fungsi hady_cmd dipindahkan ke sini
  const hady_cmd = async (cmd, api, event) => {
    try {
      const pipi = body?.replace(`${awalan}${cmd}`, "")?.trim();
      const args = pipi?.split(' ');
      const files = fs.readdirSync(path.join(__dirname, '/perintah'));
      for (const file of files) {
        if (file.endsWith('.js')) {
          const anime = path.join(path.join(__dirname, '/perintah'), file);
          const { hady, Ayanokoji, bahasa } = require(anime);
          if (hady && hady.nama === cmd && typeof Ayanokoji === 'function') {
            console.log(logo.cmds + `Menjalankan perintah ${hady.nama}.`);
            const bhs = function(veng) {
              return bahasa[nakano][veng];
            };
            if (kuldown(event.senderID, hady.nama, hady.kuldown) == 'hadi') {
              if (hady.peran == 0 || !hady.peran) {
                await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData, addThread, unregistThread, banUser, unbanUser, isThreadRegistered, fetchDatabase });
                return;
              }
              if ((hady.peran == 2 || hady.peran == 1) && admin.includes(event.senderID) || hady.peran == 0) {
                await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData, addThread, unregistThread, banUser, unbanUser, isThreadRegistered, fetchDatabase });
                return;
              } else {
                api.setMessageReaction("", event.messageID);
              }
            } else {
              api.setMessageReaction('⌛', event.messageID);
            }
          }
        }
      }
    } catch (error) {
      console.log(logo.error + 'Error dalam fungsi hady_cmd: ' + error.message);
      notiferr(`Error dalam fungsi hady_cmd: ${error.message}`);
      api.sendMessage(logo.error + 'Error dalam fungsi hady_cmd: ' + error.message, event.ThreadID);
    }
  };
  // Panggil hady_cmd
  hady_cmd(cmd, api, event);
 });
});

app.listen(port, () => { });
app.get('/', (req, res) => { 
 res.sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', '#ayanokoji.html'));
});
app.get('/laporan', (req, res) => { 
 res.sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', '#kiyopon.html'));
});
app.get('/ayanokoji', async (req, res) => {
  const text = req.query.pesan || 'hai';

  try {
    const data = {
      contents: [{ parts: [{ text: text }] }]
    };
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${aikey}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const ayanokoji = response.data.candidates[0].content.parts[0].text;
    res.json({ pembuat: "Hady Zen", ayanokoji });
  } catch (error) {
    res.json({ error: 'Maaf ada kesalahan: ' + error.message });
  }
} );
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', '#kiyotaka.html'));
});
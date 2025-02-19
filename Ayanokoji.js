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

// Konfigurasi Firebase Realtime Database
const FIREBASE_DB_URL = "https://hasune-69d6d-default-rtdb.firebaseio.com/";
const FIREBASE_AUTH_KEY = "API_KEY_KAMU"; // Ganti dengan API key Firebase kamu

process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));
const zen = { host: proxy, port: port };
const kiyopon = gradient("#ADD8E6", "#4682B4", "#00008B")(logo.ayanokoji);
const tanggal = now.format('YYYY-MM-DD');
const waktu = now.format('HH:mm:ss');
const web = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
global.Ayanokoji = { awalan: awalan, nama: nama, admin: admin, logo: logo, aikey: aikey, bahasa: nakano, web: web, maintain: maintain, waktu: waktu, tanggal: tanggal };

// Fungsi notiferr untuk mengirim notifikasi error
async function notiferr(notif) {
  try {
    const oreki = `⚡ 𝗔𝗱𝗮 𝗘𝗿𝗿𝗼𝗿\n\n𝖯𝗋𝗈𝗃𝖾𝗄: ${nama}\n𝖤𝗋𝗿𝗈𝗋: ${notif}`;
    const { data } = await axios.get(`https://api.callmebot.com/facebook/send.php?apikey=${notifkey}&text=${encodeURIComponent(oreki)}`);
    console.log(logo.info + 'Notifikasi error berhasil dikirim.');
  } catch (futaro) {
    console.log(logo.error + 'Terjadi kesalahan pada notif: ' + futaro);
  }
}

// Fungsi untuk mengakses database Firebase
async function fetchDatabase(path = '') {
  try {
    const response = await axios.get(`${FIREBASE_DB_URL}${path}.json?auth=${FIREBASE_AUTH_KEY}`);
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

// Fungsi untuk menyimpan data ke Firebase
async function updateDatabase(path, data) {
  try {
    await axios.put(`${FIREBASE_DB_URL}${path}.json?auth=${FIREBASE_AUTH_KEY}`, data);
    console.log(ayanokoji('database') + `Data berhasil diperbarui di path: ${path}`);
  } catch (error) {
    console.log(logo.error + 'Gagal memperbarui database: ' + error.message);
  }
}

// Fungsi untuk menambahkan data pengguna
async function addData(id) {
  const db = await fetchDatabase('users');
  if (!db[id]) {
    const newUser = { 
      nama: "Unknown", 
      yen: 0, 
      exp: 0, 
      level: 1, 
      daily: null, 
      id: Object.keys(db).length + 1, 
      banned: false 
    };
    await updateDatabase(`users/${id}`, newUser);
    console.log(ayanokoji('database') + `Pengguna baru ditambahkan: ${id}`);
  } else {
    console.log(ayanokoji('database') + `Pengguna ${id} sudah terdaftar.`);
  }
}

async function setUser(id, data) {
  await updateDatabase(`users/${id}`, data);
}

// Fungsi untuk mendapatkan data pengguna
async function getData(id) {
  const db = await fetchDatabase('users');
  const userData = db[id] || { 
    nama: "Unknown", 
    yen: 0, 
    exp: 0, 
    level: 1, 
    daily: null, 
    id: Object.keys(db).length + 1, 
    banned: false 
  };
  if (typeof userData.yen !== 'number' || typeof userData.exp !== 'number' || typeof userData.level !== 'number') {
    console.error("Data pengguna tidak valid:", userData);
    return null;
  }
  return userData;
}

// Fungsi untuk menambahkan data thread/grup
async function addThread(threadID, adminID) {
  try {
    const db = await fetchDatabase('threads');
    if (!db[threadID]) {
      const newThread = { 
        id: Object.keys(db).length + 1, 
        admin: adminID, 
        registered: true 
      };
      await updateDatabase(`threads/${threadID}`, newThread);
      console.log(ayanokoji('database') + `Thread ${threadID} berhasil diregistrasi.`);
      return true;
    } else {
      console.log(ayanokoji('database') + `Thread ${threadID} sudah terdaftar.`);
      return false;
    }
  } catch (error) {
    console.error("Gagal menambahkan thread:", error);
    return false;
  }
}

// Fungsi untuk unregist thread
async function unregistThread(threadID) {
  try {
    const db = await fetchDatabase('threads');
    if (db[threadID]) {
      await updateDatabase(`threads/${threadID}`, null);
      console.log(ayanokoji('database') + `Thread ${threadID} berhasil di-unregist.`);
      return true;
    } else {
      console.log(ayanokoji('database') + `Thread ${threadID} tidak terdaftar.`);
      return false;
    }
  } catch (error) {
    console.error("Gagal unregist thread:", error);
    return false;
  }
}

// Fungsi untuk mem-ban user
async function banUser(userID) {
  try {
    const db = await fetchDatabase('users');
    if (db[userID]) {
      db[userID].banned = true;
      await updateDatabase(`users/${userID}`, db[userID]);
      console.log(ayanokoji('database') + `User ${userID} telah diban.`);
      return true;
    } else {
      console.log(ayanokoji('database') + `User ${userID} tidak ditemukan.`);
      return false;
    }
  } catch (error) {
    console.error("Gagal mem-ban user:", error);
    return false;
  }
}

// Fungsi untuk unban user
async function unbanUser(userID) {
  try {
    const db = await fetchDatabase('users');
    if (db[userID]) {
      db[userID].banned = false;
      await updateDatabase(`users/${userID}`, db[userID]);
      console.log(ayanokoji('database') + `User ${userID} berhasil di-unban.`);
      return true;
    } else {
      console.log(ayanokoji('database') + `User ${userID} tidak ditemukan.`);
      return false;
    }
  } catch (error) {
    console.error("Gagal unban user:", error);
    return false;
  }
}

// Fungsi untuk mengecek apakah thread/grup sudah terdaftar
async function isThreadRegistered(threadID) {
  try {
    const db = await fetchDatabase('threads');
    return db[threadID] && db[threadID].registered === true;
  } catch (error) {
    console.error("Gagal mengecek status thread:", error);
    return false;
  }
}

// Fungsi untuk menambahkan yen dan exp
async function addYenExp(senderID, message) {
  try {
    const db = await fetchDatabase('users');

    // Pastikan data pengguna ada
    if (!db[senderID]) {
      console.log(ayanokoji('database') + `User ${senderID} tidak ditemukan.`);
      return;
    }

    // Hitung jumlah huruf dalam pesan
    const jumlahHuruf = message.length;

    // Tambahkan yen dan exp berdasarkan jumlah huruf
    const yenPerHuruf = 0.05; // Yen per huruf
    const expPerHuruf = 0.5;  // Exp per huruf

    db[senderID].yen += yenPerHuruf * jumlahHuruf;
    db[senderID].exp += expPerHuruf * jumlahHuruf;

    // Cek jika exp mencapai 2.500, naikkan level dan reset exp
    if (db[senderID].exp >= 2500) {
      db[senderID].level += 1;
      db[senderID].exp = 0;
      console.log(ayanokoji('database') + `User ${senderID} naik ke level ${db[senderID].level}.`);
    }

    // Simpan perubahan ke database
    await updateDatabase(`users/${senderID}`, db[senderID]);
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

// (Login, command handling, dan Express server tetap sama seperti sebelumnya)
async function loadC() {
  fs.readFileSync('kiyotaka.json')
};

console.log(kiyopon);
setInterval(function() { loadC(); }, 1000);
cron.schedule('0 */4 * * *', () => {
  console.clear();
  process.exit();
  const child = spawn("refresh", {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
});
    child.on('error', (err) => {
    console.log(logo.error + 'Ada error pada autorest: ', err);
});
    child.on('exit', (code) => {
      if (code === 0) {
    console.log(ayanokoji('restar') + nama + ' berhasil dimulai ulang.');
       } else {
    console.log(logo.error + nama + ' gagal dimulai ulang: ', code);
  }
 });
});
console.log(ayanokoji('versi') + `${version}.`);
console.log(ayanokoji('awalan') + `${awalan}`);
console.log(ayanokoji('bahasa') + `${nakano}.`);
console.log(ayanokoji('admin') + `${admin}.`);
console.log(ayanokoji('webview') + `${web}.`);
fs.readdir('./perintah', (err, files) => { 
 const shadow = files.map(file => path.parse(file).name);
console.log(ayanokoji('perintah') + `${shadow}.`);
});

if (!akun || akun.length < 0 || !JSON.parse(akun)) {
 console.log(logo.error + 'Kamu belum memasukkan cookie.');
 process.exit();
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
  if (!body || global.Ayanokoji.maintain === true && !admin.includes(event.senderID) || chatdm === false && event.isGroup == false && !admin.includes(event.senderID)) return;
  // Cek apakah thread sudah terdaftar
  if (event.isGroup) {
    const isRegistered = await isThreadRegistered(event.threadID);
    if (!isRegistered) {
      if (!admin.includes(event.senderID)) {
        return;
      }
    }
  }
  // Lanjutkan ke penanganan perintah lainnya
  addData(event.senderID);
  await addYenExp(event.senderID, body);
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
                await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData, addThread, unregistThread, banUser, unbanUser, isThreadRegistered });
                return;
              }
              if ((hady.peran == 2 || hady.peran == 1) && admin.includes(event.senderID) || hady.peran == 0) {
                await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData, addThread, unregistThread, banUser, unbanUser, isThreadRegistered });
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
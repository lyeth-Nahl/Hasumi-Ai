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


async function notiferr(notif) {
  try {
    const oreki = `⚡ 𝗔𝗱𝗮 𝗘𝗿𝗿𝗼𝗿\n\n𝖯𝗋𝗈𝗃𝖾𝗄: ${nama}\n𝖤𝗋𝗿𝗼𝗿: ${notif}`;
    const { data } = await axios.get(`https://api.callmebot.com/facebook/send.php?apikey=${notifkey}&text=${encodeURIComponent(oreki)}`);
    console.log(logo.info + 'Notifikasi error berhasil dikirim.');
  } catch (futaro) {
    console.log(logo.error + 'Terjadi kesalahan pada notif: ' + futaro);
  }
}

// Konfigurasi Database Real-Time (Ganti dengan link database kamu)
const DB_URL = "https://<link-database-kamu>.json"; // Contoh: https://api.jsonbin.io/v3/b/<bin-id>
const DB_API_KEY = "API_KEY_KAMU"; // Jika diperlukan

process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));
const zen = { host: proxy, port: port };
const kiyopon = gradient("#ADD8E6", "#4682B4", "#00008B")(logo.ayanokoji);
const tanggal = now.format('YYYY-MM-DD');
const waktu = now.format('HH:mm:ss');
const web = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
global.Ayanokoji = { awalan: awalan, nama: nama, admin: admin, logo: logo, aikey: aikey, bahasa: nakano, web: web, maintain: maintain, waktu: waktu, tanggal: tanggal };

// Fungsi untuk mengakses database
async function fetchDatabase() {
  try {
    const response = await axios.get(DB_URL, {
      headers: {
        'X-Master-Key': DB_API_KEY // Jika menggunakan JSONBin.io
      }
    });
    return response.data || {};
  } catch (error) {
    console.log(logo.error + 'Gagal mengambil data dari database: ' + error.message);
    return {};
  }
}

async function updateDatabase(data) {
  try {
    await axios.put(DB_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': DB_API_KEY // Jika menggunakan JSONBin.io
      }
    });
  } catch (error) {
    console.log(logo.error + 'Gagal memperbarui database: ' + error.message);
  }
}

// Fungsi untuk menambahkan data pengguna
async function addData(id) {
  const db = await fetchDatabase();
  if (!db.users) db.users = {};
  if (!db.users[id]) {
    db.users[id] = {
      nama: "Kiyopon User",
      yen: 0,
      exp: 0,
      level: 1,
      daily: null,
      id: Object.keys(db.users).length + 1 // ID Custom
    };
    await updateDatabase(db);
    console.log(ayanokoji('database') + `${id} pengguna baru.`);
  }
}

// Fungsi untuk mengupdate data pengguna
async function setUser(id, item, baru) {
  const db = await fetchDatabase();
  if (db.users && db.users[id]) {
    if (item === "nama" || item === "daily") {
      db.users[id][item] = baru;
    } else if (item === "yen" || item === "exp" || item === "level") {
      if (typeof baru === 'number') {
        db.users[id][item] = baru;
      } else {
        console.log(ayanokoji('database') + 'Nilai untuk ' + item + ' harus berupa angka.');
        return;
      }
    }
    await updateDatabase(db);
    console.log(ayanokoji('database') + 'Pembaruan berhasil.');
  }
}

// Fungsi untuk mendapatkan data pengguna
async function getData(id) {
  const db = await fetchDatabase();
  return db.users ? db.users[id] || {} : {};
}

// Fungsi untuk menambahkan data thread/grup
async function addThread(threadID, adminID) {
  const db = await fetchDatabase();
  if (!db.threads) db.threads = {};
  if (!db.threads[threadID]) {
    db.threads[threadID] = {
      id: Object.keys(db.threads).length + 1, // ID Custom
      admin: adminID,
      registered: true
    };
    await updateDatabase(db);
    console.log(ayanokoji('database') + `Thread ${threadID} berhasil diregistrasi.`);
  }
}

// Fungsi untuk mengecek apakah thread/grup sudah terdaftar
async function isThreadRegistered(threadID) {
  const db = await fetchDatabase();
  return db.threads && db.threads[threadID] && db.threads[threadID].registered;
}

// Fungsi untuk menambahkan yen dan exp
async function addYenExp(senderID) {
  const db = await fetchDatabase();
  if (db.users && db.users[senderID]) {
    db.users[senderID].yen += 0.05;
    db.users[senderID].exp += 0.5;

    if (db.users[senderID].exp >= 2500) {
      db.users[senderID].level += 1;
      db.users[senderID].exp = 0;
    }

    await updateDatabase(db);
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

// Fungsi untuk ban user atau thread
async function banUser(userID) {
  const db = await fetchDatabase();
  if (db.users && db.users[userID]) {
    db.users[userID].banned = true;
    await updateDatabase(db);
    console.log(ayanokoji('database') + `User ${userID} telah diban.`);
  }
}

async function banThread(threadID) {
  const db = await fetchDatabase();
  if (db.threads && db.threads[threadID]) {
    db.threads[threadID].banned = true;
    await updateDatabase(db);
    console.log(ayanokoji('database') + `Thread ${threadID} telah diban.`);
  }
}

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
      
   api.listenMqtt((err, event) => {
if (err) {
  notiferr(`${err.message || err.error}`);
  console.log(logo.error + `${err.message || err.error}`);
  process.exit();
}
const body = event.body;
if (!body || global.Ayanokoji.maintain === true && !admin.includes(event.senderID) || chatdm === false && event.isGroup == false && !admin.includes(event.senderID)) return; 
  addData(event.senderID);
if (body.toLowerCase() == "prefix") return api.sendMessage(`⚡ Awalan ${nama}: ${awalan}`, event.threadID, event.messageID);
if (!body.startsWith(awalan)) return console.log(logo.pesan + `${event.senderID} > ${body}`);
   const cmd = body.slice(awalan.length).trim().split(/ +/g).shift().toLowerCase();
	   
 async function hady_cmd(cmd, api, event) {
    const pipi = body?.replace(`${awalan}${cmd}`, "")?.trim();
    const args = pipi?.split(' ');

	 try {
    const skibidi = await new Promise((resolve, reject) => { api.getThreadInfo(event.threadID, (err, info) => { if (err) reject(err); else resolve(info); }); });
    const fitri = skibidi.adminIDs.map(admin => admin.id);
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
    await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData });
    return;
}
if ((hady.peran == 2 || hady.peran == 1) && admin.includes(event.senderID) || hady.peran == 0) {
    await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData });
    return;
} else if (hady.peran == 1 && fitri.join(', ').includes(event.senderID) || hady.peran == 0) {
    await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData });
    return;
} else { 
    api.setMessageReaction("❗", event.messageID);
}

  } else {
   api.setMessageReaction('⌛', event.messageID);
   }
  } 
 }
}
 } catch (error) {
   notiferr(`Perintah error: ${error.message}`);
   console.log(logo.error + 'Perintah error: ' + error.message);
 }
}
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
});
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'hady-zen', 'kiyotaka', '#kiyotaka.html'));
});
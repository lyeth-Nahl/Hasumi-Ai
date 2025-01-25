/* HADY ZEN'IN */
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./horikita.db');

// Fungsi untuk membuat tabel

function createTable() {

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

}

// Fungsi untuk menyimpan data

function saveData(id_fb, nama_fb, id_costum) {

  db.run(`INSERT INTO pengguna (id_fb, nama_fb, id_costum) VALUES (?, ?, ?)`, [id_fb, nama_fb, id_costum], (err) => {

    if (err) {

      console.log(err.message);

    } else {

      console.log('Data berhasil disimpan');

    }

  });

}

// Fungsi untuk mengambil data

function getData(id_fb) {

  db.get(`SELECT * FROM pengguna WHERE id_fb = ?`, [id_fb], (err, row) => {

    if (err) {

      console.log(err.message);

    } else {

      console.log(row);

    }

  });

}

// Jalankan fungsi untuk membuat tabel

createTable();

// Export fungsi-fungsi

module.exports = {

  saveData,

  getData,

  // Fungsi-fungsi lainnya di Ayanokoji.js

};
 const express = require('express');
 const app = express();
 const login = require('./hady-zen/ayanokoji');
 const { logo, warna, font, ayanokoji } = require('./hady-zen/log');
 const fs = require('fs');
 const path = require('path');
 const axios = require('axios');
 const akun = fs.readFileSync('akun.txt', 'utf8');
 const { version } = require('./package');
 const gradient = require('gradient-string');
 const { awalan, nama, admin, proxy, port, bahasa: nakano, maintain, chatdm, notifkey, aikey, setting } = require('./kiyotaka');
 const { kuldown } = require('./hady-zen/kuldown');

process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));
const zen = { host: proxy, port: port };
const kiyopon = gradient("#4A90E2", "#50E3C2", "#B8E986")(logo.ayanokoji);
global.Ayanokoji = { awalan: awalan, nama: nama, admin: admin, logo: logo, aikey: aikey };

async function notiferr(notif) { 
  try { 
 const oreki = `♡ 𝗔𝗱𝗮 𝗘𝗿𝗿𝗼𝗿\n\n𝖯𝗋𝗈𝗃𝖾𝗄: ${nama}\n𝖤𝗋𝗋𝗈𝗋: ${notif}`;
 const { data } = await axios.get(`https://api.callmebot.com/facebook/send.php?apikey=${notifkey}&text=${encodeURIComponent(oreki)}`);
  } catch (futaro) {
   console.log(logo.error + 'Terjadi kesalahan pada notif error: ' + futaro);
  }
};
async function getStream(hadi, isekai) {
    try {
  const kiyotaka = await axios.get(hadi, { responseType: 'arraybuffer' });
  const otaku = Buffer.from(kiyotaka.data, 'binary');
  const wibu = path.join(__dirname, 'hady-zen', isekai);
    fs.writeFileSync(wibu, otaku);
      return wibu;
  } catch (error) {
    throw error;
 }
};
async function getNama(kiyo) {
 try {
const user = await axios.post(`https://www.facebook.com/api/graphql/?q=${`node(${kiyo}){name}`}`);
 return user.data[userID].name;
 } catch (error) {
 return null;
 }
};
async function loadC() {
  fs.readFileSync('kiyotaka.json')
};

console.log(kiyopon);
setInterval(function() { loadC(); }, 60000); 
console.log(ayanokoji('versi') + `${version}.`);
console.log(ayanokoji('awalan') + `${awalan}`);
console.log(ayanokoji('bahasa') + `${nakano}.`);
console.log(ayanokoji('admin') + `${admin}.`);
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
if (!body || maintain == true && !admin.includes(event.senderID) || chatdm == false && event.isGroup == false && !admin.includes(event.senderID)) return; 
if (body.toLowerCase() == "prefix") return api.sendMessage(`♡ Awalan ${nama} adalah : ${awalan}`, event.threadID, event.messageID);
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
    await Ayanokoji({ api, event, args, bhs, getStream, loadC });
    return;
}
if ((hady.peran == 2 || hady.peran == 1) && admin.includes(event.senderID) || hady.peran == 0) {
    await Ayanokoji({ api, event, args, bhs, getStream, loadC });
    return;
} else if (hady.peran == 1 && fitri.join(', ').includes(event.senderID) || hady.peran == 0) {
    await Ayanokoji({ api, event, args, bhs, getStream, loadC });
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

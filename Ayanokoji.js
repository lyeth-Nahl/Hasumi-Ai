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
const DATABASE_URL = 'https://hasune-69d6d-default-rtdb.firebaseio.com/';

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

// Fungsi untuk notifikasi error
async function notiferr(notif) { 
  try { 
    const oreki = `⚡ 𝗔𝗱𝗮 𝗘𝗿𝗿𝗼𝗿\n\n𝖯𝗋𝗈𝗃𝖾𝗄: ${nama}\n𝖤𝗋𝗿𝗈𝗋: ${notif}`;
    const { data } = await axios.get(`https://api.callmebot.com/facebook/send.php?apikey=${notifkey}&text=${encodeURIComponent(oreki)}`);
  } catch (futaro) {
    console.log(logo.error + 'Terjadi kesalahan pada notif' + futaro);
  }
}

// Fungsi untuk mengambil stream
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
}

// Fungsi untuk memuat config
async function loadC() {
  fs.readFileSync('kiyotaka.json');
}

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

    // Tambahkan pengguna baru jika belum ada
    addData(event.senderID);

    // Proses pesan untuk menambahkan yen/exp
    processMessage(event.senderID, body);

    if (body.toLowerCase() == "prefix") return api.sendMessage(` Awalan ${nama}: [ ${awalan} ]`, event.threadID, event.messageID);
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
                const userData = await getData(event.senderID);

                if (hady.peran == 0 || !hady.peran) {
                  await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData: () => userData });
                  return;
                }
                if ((hady.peran == 2 || hady.peran == 1) && admin.includes(event.senderID) || hady.peran == 0) {
                  await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData: () => userData });
                  return;
                } else if (hady.peran == 1 && fitri.join(', ').includes(event.senderID) || hady.peran == 0) {
                  await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData: () => userData });
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
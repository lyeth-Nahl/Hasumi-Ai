/* HADY ZEN'IN */

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
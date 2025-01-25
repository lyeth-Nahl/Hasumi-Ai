const axios = require('axios');
const fs = require('fs');

module.exports = {
  hady: {
    nama: "status",
    penulis: "Hady Zen",
    peran: 0,
    kuldown: 5,
    tutor: ""
  },
  Ayanokoji: async function ({ api, event, getStream }) {
    const id_fb = event.senderID;
    const nama_fb = event.senderName;
    const status = `♡ 𝗦𝘁𝗮𝘁𝘂𝘀 - 𝖭𝖺𝗆𝖺: ${nama_fb} - 𝖨𝖣: ${id_fb}`;
    api.sendMessage(status, event.threadID, event.messageID);
  }
};
const fs = require('fs');
const path = require('path');

module.exports = {
  hady: {
  nama: "restart",
  penulis: "Horikita",
  kuldown: 5,
  peran: 2,
  tutor: "restart",
  Ayanokoji: async function ({ api, event, args, client, __ }) {
    api.sendMessage("Restarting project...", event.threadID, event.messageID);
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
};
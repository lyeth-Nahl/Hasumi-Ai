const fs = require('fs');
const path = require('path');

const status = path.join(__dirname, '..', 'status.json');
const dsDataPath = path.join(__dirname, 'ds.json');
const dsData = require(dsDataPath);
const statusdata = require(status);
module.exports = {
  hady: {
    nama: "ds",
    penulis: "Nahl",
    kuldown: 0,
    peran: 0,
    tutor: ""
  },
  Ayanokoji: async function({ api, event }) {
    const args = event.body.split(' ');
    const command = args[0].toLowerCase();

    if (command === 'ds') {
      if (args[1] === 'info') {
        const info = `Informasi Gacha Kartu Demon Slayer\nKartu Demon Slayer\n• Drop Rate - R: 98.7% - SR: 30.2% - SSR: 3.2%\n• Harga Market - R: 8.5¥ - SR: 14¥ - SSR: 28¥`;
        api.sendMessage(info, event.threadID);
      } else if (args[1] === 'pull') {
        const hargaPull = 10;
        const status = await fs.readFile(statusPath, 'utf8');
        const dataStatus = JSON.parse(status);
        if (!dataStatus[event.senderID]) {
          dataStatus[event.senderID] = { yen: 0, cards: [] };
        }
        if (dataStatus[event.senderID].yen >= hargaPull) {
          dataStatus[event.senderID].yen -= hargaPull;
          const kartu = {
            nama: dsData[Math.floor(Math.random() * dsData.length)].nama,
            rarity: Math.random() < 0.032 ? 'SSR' : Math.random() < 0.334 ? 'SR' : 'R'
          };
          dataStatus[event.senderID].cards.push(kartu);
          await fs.writeFile(statusPath, JSON.stringify(dataStatus, null, 2));
          api.sendMessage(`Kamu berhasil menarik kartu! Kamu mendapatkan ${kartu.nama} (${kartu.rarity})!`, event.threadID);
        } else {
          api.sendMessage(`Kamu tidak memiliki yen yang cukup untuk menarik kartu!`, event.threadID);
        }
      } else if (args[1] === 'inv') {
        const status = await fs.readFile(statusPath, 'utf8');
        const dataStatus = JSON.parse(status);
        if (!dataStatus[event.senderID]) {
          api.sendMessage(`Kamu belum memiliki kartu!`, event.threadID);
        } else {
          const cards = dataStatus[event.senderID].cards;
          let message = 'Inventory Kartu Kamu:\n';
          cards.forEach((card, index) => {
            message += `${index + 1}. ${card.nama} (${card.rarity})\n`;
          });
          api.sendMessage(message, event.threadID);
        }
      } else if (args[1] === 'sell') {
        const status = await fs.readFile(statusPath, 'utf8');
        const dataStatus = JSON.parse(status);
        if (!dataStatus[event.senderID]) {
          api.sendMessage(`Kamu belum memiliki kartu!`, event.threadID);
        } else {
          const cards = dataStatus[event.senderID].cards;
          const cardName = args[2];
          const cardIndex = cards.findIndex(card => card.nama === cardName);
          if (cardIndex === -1) {
            api.sendMessage(`Kamu tidak memiliki kartu ${cardName}!`, event.threadID);
          } else {
            cards.splice(cardIndex, 1);
            dataStatus[event.senderID].cards = cards;
            await fs.writeFile(statusPath, JSON.stringify(dataStatus, null, 2));
            api.sendMessage(`Kamu berhasil menjual kartu ${cardName}!`, event.threadID);
          }
        }
      }
    }
  }
};
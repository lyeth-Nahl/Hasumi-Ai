const fs = require('fs');
const path = require('path');
const statusPath = path.join(__dirname, '..', 'status.json');

const statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
const dsDataPath = path.join(__dirname, 'ds.json');
const dsData = require(dsDataPath);
const gacha = () => {
  const rarityRates = { R: 0.987, SR: 0.302, SSR: 0.032 };
  const getRarity = () => {
    const random = Math.random();
    if (random < rarityRates.SSR) {
      return 'SSR';
    } else if (random < rarityRates.SSR + rarityRates.SR) {
      return 'SR';
    } else {
      return 'R';
    }
  };
  const rarity = getRarity();
  const kartu = { nama: dsData[Math.floor(Math.random() * dsData.length)].nama, rarity: rarity };
  return kartu;
};

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
    const userData = require(statusPath);

    if (command === 'ds') {
      if (args[1] === 'info') {
        const info = ` Informasi Gacha Kartu Demon Slayer Kartu Demon Slayer • Drop Rate - R: 98.7% - SR: 30.2% - SSR: 3.2% • Harga Market - R: 8.5¥ - SR: 14¥ - SSR: 28¥ `;
        api.sendMessage(info, event.threadID);
      } else if (args[1] === 'pull') {
        const userIndex = userData.findIndex(user => user.id === event.senderID);
        if (userIndex === -1) {
          userData.push({ id: event.senderID, yen: 0, cards: [] });
        }
        if (userData[userIndex].yen < 10) {
          api.sendMessage('Saldo Anda tidak cukup untuk melakukan pull.', event.threadID);
          return;
        }
        userData[userIndex].yen -= 10;
        const kartu = gacha();
        const cardData = dsData.find(card => card.nama === kartu.nama);
        userData[userIndex].cards.push(kartu);
        fs.writeFileSync(statusPath, JSON.stringify(userData, null, 2));
        if (cardData) {
          api.sendMessage({
            body: `Selamat, Anda mendapatkan kartu ${kartu.nama}! Saldo Anda sekarang: ${userData[userIndex].yen} yen.`,
            attachment: cardData.gambar
          }, event.threadID);
        } else {
          api.sendMessage({
            body: `Selamat, Anda mendapatkan kartu ${kartu.nama}! Saldo Anda sekarang: ${userData[userIndex].yen} yen.`
          }, event.threadID);
        }
      } else if (args[1] === 'inv') {
        const userIndex = userData.findIndex(user => user.id === event.senderID);
        if (userIndex === -1) {
          api.sendMessage('Anda belum memiliki kartu.', event.threadID);
        } else {
          const cards = userData[userIndex].cards;
          let message = 'Inventory Kartu Anda:\n';
          cards.forEach((card, index) => {
            message += `${index + 1}. ${card.nama} (${card.rarity})\n`;
          });
          api.sendMessage(message, event.threadID);
        }
      } else if (args[1] === 'sell') {
        const userIndex = userData.findIndex(user => user.id === event.senderID);
        if (userIndex === -1) {
          api.sendMessage('Anda belum memiliki kartu.', event.threadID);
        } else {
          const cards = userData[userIndex].cards;
          const cardName = args[2];
          const cardIndex = cards.findIndex(card => card.nama === cardName);
          if (cardIndex === -1) {
            api.sendMessage(`Anda tidak memiliki kartu ${cardName}.`, event.threadID);
          } else {
            cards.splice(cardIndex, 1);
            api.sendMessage(`Anda berhasil menjual kartu ${cardName}.`, event.threadID);
          }
        }
      }
    }
  }
};
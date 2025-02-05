const fs = require('fs');
const dsData = require('./ds.json');
const userData = require('./status.json');

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
const dsInfo = async ({ api, event }) => {
  const info = `
Informasi Gacha Kartu Demon Slayer

Kartu Demon Slayer

• Drop Rate
 - R: 98.7%
 - SR: 30.2%
 - SSR: 3.2%

• Harga Market
 - R: 8.5¥
 - SR: 14¥
 - SSR: 28¥
`;
  api.sendMessage(info, event.threadID);
}
const dsPull = async ({ api, event }) => {
  const userIndex = userData.findIndex(user => user.id === event.senderID);
  if (userIndex === -1) {
    userData.push({ id: event.senderID, yen: 0, cards: [] });
  }
  if (userData[userIndex].yen < 10) {
    api.sendMessage('Saldo Anda tidak cukup untuk melakukan pull.', event.threadID);
    return;
  }
  const dsInv = async ({ api, event }) => {
  const userIndex = userData.findIndex(user => user.id === event.senderID);
  if (userIndex === -1) {
    api.sendMessage('Anda belum memiliki kartu.', event.threadID);
  } else {
    const cards = userData[userIndex].cards;
    let message = 'Inventory Kartu Anda:\n';
    cards.forEach((card, index) => {
      message += `${index + 1}. ${card.nama}\n`;
    });
    api.sendMessage(message, event.threadID);
  }
};
  
const dsSell = async ({ api, event }) => {
  const args = event.body.split(' ');
  if (args[2] === 'c') {
    const jumlah = parseInt(args[3]);
    const cardName = args[4];
    const userIndex = userData.findIndex(user => user.id === event.senderID);
    if (userIndex === -1) {
      api.sendMessage('Anda belum memiliki kartu.', event.threadID);
    } else {
      const cards = userData[userIndex].cards;
      const cardIndex = cards.findIndex(card => card.nama === cardName);
      if (cardIndex === -1) {
        api.sendMessage(`Anda tidak memiliki kartu ${cardName}.`, event.threadID);
      } else if (cards[cardIndex].jumlah < jumlah) {
        api.sendMessage(`Anda tidak memiliki cukup kartu ${cardName} untuk dijual.`, event.threadID);
      } else {
        cards[cardIndex].jumlah -= jumlah;
        api.sendMessage(`Anda berhasil menjual ${jumlah} kartu ${cardName}.`, event.threadID);
      }
    }
  } else {
    const cardName = args[2];
    const userIndex = userData.findIndex(user => user.id === event.senderID);
    if (userIndex === -1) {
      api.sendMessage('Anda belum memiliki kartu.', event.threadID);
    } else {
      const cards = userData[userIndex].cards;
      const cardIndex = cards.findIndex(card => card.nama === cardName);
      if (cardIndex === -1) {
        api.sendMessage(`Anda tidak memiliki kartu ${cardName}.`, event.threadID);
      } else {
        cards.splice(cardIndex, 1);
        api.sendMessage(`Anda berhasil menjual kartu ${cardName}.`, event.threadID);
      }
    }
  }
};
if (command === 'ds') {
  if (args[1] === 'info') {
    dsInfo({ api, event });
  } else if (args[1] === 'pull') {
    dsPull({ api, event });
  } else if (args[1] === 'inv') {
    dsInv({ api, event });
  } else if (args[1] === 'sell') {
    dsSell({ api, event });
  }
}
};
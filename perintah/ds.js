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

    if (command === 'ds') {
      if (args[1] === 'info') {
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
        };
        dsInfo({ api, event });
      } else if (args[1] === 'pull') {
        const dsPull = async ({ api, event }) => {
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
          userData[userIndex].cards.push(kartu);

          fs.writeFileSync('./status.json', JSON.stringify(userData, null, 2));

          api.sendMessage({
            body: `Selamat, Anda mendapatkan kartu ${kartu.nama}! Saldo Anda sekarang: ${userData[userIndex].yen} yen.`,
            attachment: fs.createReadStream(__dirname + `/cards/${kartu.nama}.jpg`)
          }, event.threadID);
        };
        dsPull({ api, event });
      }
    }
  }
};
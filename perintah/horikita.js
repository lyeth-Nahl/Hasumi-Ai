const fs = require('fs');
const axios = require('axios');

module.exports = {
  hady: {
    nama: "horikita",
    penulis: "Hady Zen",
    kuldown: 10,
    peran: 0,
    tutor: "<pertanyaan>"
  },
  bahasa: {
    id: {
      hadi: "Kamu belum memasukkan pertanyaan nya.",
      hapus: "Ingatan kamu telah dihapus!"
    },
    en: {
      hadi: "You haven't given her a question yet.",
      hapus: "Your memory has been deleted!"
    }
  },
  Ayanokoji: async function ({ api, event, args, bhs }) {
    const ingatanPath = './ingatan.json';
    let ingatan = {};
    try {
      ingatan = JSON.parse(fs.readFileSync(ingatanPath, 'utf8'));
    } catch (err) {
      console.error(err);
    }
    if (args[0] === 'hapus') {
      if (ingatan[event.senderID]) {
        delete ingatan[event.senderID];
        fs.writeFileSync(ingatanPath, JSON.stringify(ingatan, null, 2));
        api.sendMessage(bhs('hapus'), event.threadID, event.messageID);
      } else {
        api.sendMessage('Kamu tidak memiliki ingatan yang dapat dihapus!', event.threadID, event.messageID);
      }
    } else if (!args.join(' ')) {
      return api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
    } else {
      const hadi = `kamu harus role play menjadi Ayanokoji Kiyotaka. User input: ${args.join(' ')}`;
      if (!ingatan[event.senderID]) ingatan[event.senderID] = {};
      ingatan[event.senderID].hadi = hadi;
      fs.writeFileSync(ingatanPath, JSON.stringify(ingatan, null, 2));
      const aya = await axios.get(`https://green-unique-eustoma.glitch.me/ayanokoji?pesan=${encodeURIComponent(hadi)}`);
      api.sendMessage(aya.data.ayanokoji, event.threadID, event.messageID);
    }
  }
};
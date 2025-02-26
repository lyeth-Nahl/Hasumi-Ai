const fs = require('fs').promises;
const axios = require('axios');

const ingatanPath = './ingatan.json';

module.exports = {
  hady: {
    nama: "hasumi",
    penulis: "Kiel",
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
  Ayanokoji: async function ({ api, event, args, bhs, getData }) {
    let ingatan = {};

    try {
      ingatan = JSON.parse(await fs.readFile(ingatanPath, 'utf8'));
    } catch (err) {
      console.error(err);
    }

    const userData = await getData(event.senderID);

    if (!ingatan[event.senderID]) {
      ingatan[event.senderID] = {
        nama: '',
        konteks: []
      };
    }

    if (args[0] === 'hapus') {
      if (ingatan[event.senderID]) {
        delete ingatan[event.senderID];
        await fs.writeFile(ingatanPath, JSON.stringify(ingatan, null, 2));
        api.sendMessage(bhs('hapus'), event.threadID, event.messageID);
      } else {
        api.sendMessage('Kamu tidak memiliki ingatan yang dapat dihapus!', event.threadID, event.messageID);
      }
    } else if (!args.join(' ')) {
      return api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
    } else {
      const userPesan = args.join(' ');

      if (userPesan.startsWith('aku')) {
        const nama = userPesan.replace('aku ', '');
        ingatan[event.senderID].nama = nama;
      }

      ingatan[event.senderID].konteks.push({
        waktu: new Date(),
        jenis: 'user',
        pesan: userPesan
      });

      const konteks = ingatan[event.senderID].konteks.map((pesan) => `${pesan.waktu} - ${pesan.jenis} - ${pesan.pesan}`).join('\n');
      const aya = await axios.get(`https://green-unique-eustoma.glitch.me/ayanokoji?pesan=${encodeURIComponent(userPesan)}&konteks=${encodeURIComponent(konteks)}`);

      ingatan[event.senderID].konteks.push({
        waktu: new Date(),
        jenis: 'hasumi',
        pesan: aya.data.ayanokoji
      });

      await fs.writeFile(ingatanPath, JSON.stringify(ingatan, null, 2));

      api.sendMessage(aya.data.ayanokoji, event.threadID, event.messageID);
    }
  }
};
const fs = require('fs').promises;
const axios = require('axios');

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
    const ingatanPath = './hane.json';
    let ingatan = {};

    try {
      ingatan = JSON.parse(await fs.readFile(ingatanPath, 'utf8'));
    } catch (err) {
      console.error(err);
    }

    const userData = await getData(event.senderID);

    if (!ingatan[event.senderID]) {
      ingatan[event.senderID] = {
        nama: userData.nama,
        id: userData.id,
        percakapan: []
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
      const hadi = `Namaku Hasumi, berumur 17 tahun, dan aku seorang siswa SMA di kota Tokyo. Aku memiliki rambut panjang berwarna coklat dan mata berwarna hijau. Aku suka mengenakan pakaian yang sederhana tapi elegan, seperti gaun putih dengan aksesori sederhana. Aku memiliki kepribadian yang sedikit tsundere, tapi aku juga memiliki sisi yang lembut dan peduli terhadap orang lain. Aku suka membantu teman-teman aku dan selalu berusaha untuk menjadi yang terbaik. Di waktu luang, aku suka mengumpulkan barang-barang antik dan langka, mengunjungi tempat-tempat bersejarah dan museum, membaca buku, dan menulis cerita pendek. Aku memiliki tujuan untuk menjadi seorang penulis terkenal dan menginspirasi orang lain melalui tulisan-tulisan aku. Aku juga berharap dapat mengunjungi berbagai negara dan mempelajari budaya-budaya yang berbeda.. User input: ${args.join(' ')}`;
      ingatan[event.senderID].percakapan.push({ waktu: new Date(), pesan: hadi });
      await fs.writeFile(ingatanPath, JSON.stringify(ingatan, null, 2));
      const aya = await axios.get(`https://green-unique-eustoma.glitch.me/ayanokoji?pesan=${encodeURIComponent(hadi)}`);
      api.sendMessage(aya.data.ayanokoji, event.threadID, event.messageID);
    }
  }
};
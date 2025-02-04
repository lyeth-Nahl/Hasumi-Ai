const fs = require('fs');

module.exports = {
  hady: {
    nama: "tebakkata",
    penulis: "Horikita",
    kuldown: 5,
    peran: 0,
    tutor: "cmd [tebak]"
  },
  Ayanokoji: async function ({ api, event, args }) {
    const statusPath = './status.json';
    let statusData = {};

    try {
      statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    } catch (err) {
      console.error(err);
    }

    if (!statusData[event.senderID]) {
      return api.sendMessage("Kamu belum memiliki status! Ketik ;status untuk membuat status.", event.threadID);
    }

    const kata = ["kucing", "anjing", "gajah", "badak", "jerapah","dimas"];
    const hint = "Hewan peliharaan";
    const jumlahCobaan = 3;
    let cobaan = 0;

    const randomKata = kata[Math.floor(Math.random() * kata.length)];
    const blankKata = randomKata.replace(randomKata.charAt(0), "_") + randomKata.slice(1);

    while (cobaan < jumlahCobaan) {
      api.sendMessage(`${hint}\nCobaan ke-${cobaan + 1} dari ${jumlahCobaan}\n${blankKata}`, event.threadID);
      const jawaban = await api.getReply(event.threadID);

      if (jawaban.text.toLowerCase() === randomKata) {
        statusData[event.senderID].yen += 2;
        statusData[event.senderID].exp += 200;
        fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
        return api.sendMessage(`Selamat! Kamu berhasil menebak kata!\nHadiah: 2 Yen dan 200 Exp`, event.threadID);
      } else {
        cobaan++;
        api.sendMessage(`Sayang sekali! Jawabanmu salah.\nCobaan lagi!`, event.threadID);
      }
    }

    statusData[event.senderID].yen -= 1;
    fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
    return api.sendMessage(`Sayang sekali! Kamu gagal menebak kata.\nKata yang benar adalah ${randomKata}\nYen kamu berkurang 1!`, event.threadID);
  }
};
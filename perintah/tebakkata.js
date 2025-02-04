const fs = require('fs');

module.exports = {
  hady: {
    nama: "tebak",
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

    const kata = ["kucing", "anjing", "gajah", "badak", "jerapah"];
    const hint = "Hewan peliharaan";
    const jumlahCobaan = 3;
    let cobaan = 0;

    const randomKata = kata[Math.floor(Math.random() * kata.length)];
    const blankKata = "_".repeat(randomKata.length - 1) + randomKata.charAt(randomKata.length - 1);

    while (cobaan < jumlahCobaan) {
      api.sendMessage(`${hint}\nCobaan ke-${cobaan + 1} dari ${jumlahCobaan}\n${blankKata}`, event.threadID);

      await new Promise(resolve => setTimeout(resolve, 5000));

      const jawaban = await api.getMessage(event.threadID, 1);

      if (jawaban && jawaban.text.toLowerCase() === randomKata) {
        statusData[event.senderID].yen += 2;
        statusData[event.senderID].exp += 200;
        fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
        return api.sendMessage(`Selamat! Kamu berhasil menebak kata!\nHadiah: 2 Yen dan 200 Exp`, event.threadID);
      } else if (jawaban) {
        cobaan++;
        api.sendMessage(`Sayang sekali! Jawabanmu salah.\nCobaan lagi!`, event.threadID);
      } else {
        api.sendMessage(`Tidak ada jawaban! Silakan jawab lagi.`, event.threadID);
      }
    }

    statusData[event.senderID].yen -= 1;
    fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
    return api.sendMessage(`Sayang sekali! Kamu gagal menebak kata.\nKata yang benar adalah ${randomKata}\nYen kamu berkurang 1!`, event.threadID);
  }
};
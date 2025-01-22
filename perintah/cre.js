const karakterData = {
  "Ayanokoji": { harga: 1000, rarity: "SSR" },
  "Horikita": { harga: 500, rarity: "SR" },
  "Sudou": { harga: 200, rarity: "R" },
  "Ichinose": { harga: 300, rarity: "R" },
  "Mikuru": { harga: 100, rarity: "N" }
};

const userKoin = global.userKoin = {};
const userInventory = global.userInventory = {};

module.exports = {
  nama: "cre",
  peran: 0,
  kuldown: 5,
  author: "Nahl",
  gacha: async function ({ api, event }) {
    try {
      // Cek koin pengguna
      if (!userKoin[event.senderID] || userKoin[event.senderID] < 230) {
        api.sendMessage("Koin tidak cukup! (230 koin dibutuhkan)", event.threadID, event.messageID);
        return;
      }

      // Kurangi koin pengguna
      userKoin[event.senderID] -= 230;

      const karakter = Object.keys(karakterData);
      const hasilGacha = [];

      // Gacha 10 kali
      for (let i = 0; i < 10; i++) {
        const karakterAcak = karakter[Math.floor(Math.random() * karakter.length)];
        const rarityAcak = karakterData[karakterAcak].rarity;
        hasilGacha.push({ nama: karakterAcak, rarity: rarityAcak });
      }

      // Simpan hasil gacha ke inventori pengguna
      if (!userInventory[event.senderID]) userInventory[event.senderID] = [];
      userInventory[event.senderID].push(...hasilGacha);

      // Kirim hasil gacha
      const pesan = `Hasil Gacha:\n${hasilGacha.map((karakter) => `${karakter.nama} (${karakter.rarity})`).join("\n")}\nKoin: ${userKoin[event.senderID]}`;
      api.sendMessage(pesan, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    }
  },
  topup: async function ({ api, event, args }) {
    try {
      const jumlahKoin = parseInt(args[0]);
      if (!userKoin[event.senderID]) userKoin[event.senderID] = 0;
      userKoin[event.senderID] += jumlahKoin;
      api.sendMessage(`Koin ditambahkan! Total koin: ${userKoin[event.senderID]}`, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    }
  },
  sell: async function ({ api, event, args }) {
    try {
      const namaKarakter = args[0];
      const harga = karakterData[namaKarakter].harga;

      // Cek apakah pengguna memiliki karakter
      if (!userInventory[event.senderID] || !userInventory[event.senderID].some((karakter) => karakter.nama === namaKarakter)) {
        api.sendMessage("Karakter tidak ada di inventori!", event.threadID, event.messageID);
        return;
      }

      // Jual karakter
      userInventory[event.senderID] = userInventory[event.senderID].filter((karakter) => karakter.nama !== namaKarakter);
      userKoin[event.senderID] += harga;
      api.sendMessage(`Karakter ${namaKarakter} dijual seharga ${harga} koin! Total koin: ${userKoin[event.senderID]}`, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
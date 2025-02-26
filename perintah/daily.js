const dailyReward = {};

module.exports = {
  hady: {
    nama: "daily",
    penulis: "Kiel",
    kuldown: 5,
    peran: 0,
    tutor: ""
  },
  Ayanokoji: async function ({ api, event, getData, setUser }) {
    const userData = await getData(event.senderID);
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    if (dailyReward[event.senderID] && dailyReward[event.senderID] === today) {
      return api.sendMessage("Anda sudah mengambil daily reward hari ini. Silakan coba lagi besok!", event.threadID, event.messageID);
    }

    const pendapatanYen = Math.floor(Math.random() * 50) + 1;
    const pendapatanExp = Math.floor(Math.random() * 50) + 10;

    userData.yen = (userData.yen || 0) + pendapatanYen;
    userData.exp = (userData.exp || 0) + pendapatanExp;

    await setUser(event.senderID, userData);

    dailyReward[event.senderID] = today;

    return api.sendMessage(`Selamat! Anda mendapatkan ${pendapatanYen} yen dan ${pendapatanExp} exp sebagai hadiah harian!`, event.threadID, event.messageID);
  }
};
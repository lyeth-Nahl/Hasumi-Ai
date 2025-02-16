module.exports = {
  hady: {
    nama: "setn",
    penulis: "kiel",
    peran: 0,
    kuldown: 10,
    tutor: "<id>"
  },
  bahasa: {
    id: {
      hadi: "Kamu belum memberikan id nya.",
      berhasil: "Nama kamu telah diubah menjadi",
      yenKurang: "Yen kamu tidak cukup!"
    },
    en: {
      hadi: "You haven't given her id yet.",
      berhasil: "Your name has been changed to",
      yenKurang: "You don't have enough yen!"
    }
  },
  Ayanokoji: async function ({ api, event, args, bhs }) {
    if (args.length === 0) {
      api.sendMessage(bhs.hadi, event.threadID);
      return;
    }
    const namaBaru = args.join(" ");
    const userData = await getData(event.senderID);
    if (userData) {
      if (userData.yen < 0.5) {
        api.sendMessage(bhs.yenKurang, event.threadID);
        return;
      }
      userData.nama = namaBaru;
      userData.yen -= 0.5;
      await updateDatabase(`users/${event.senderID}`, userData);
      api.sendMessage(`${bhs.berhasil} ${namaBaru}`, event.threadID);
    } else {
      api.sendMessage("Data pengguna tidak ditemukan", event.threadID);
    }
  }
};
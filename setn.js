= {
  hady: {
    nama: "setn",
    penulis: "",
    peran: 0,
    kuldown: 10,
    tutor: "<id>"
  },
  bahasa: {
    id: {
      hadi: "Kamu belum memberikan id nya.",
      berhasil: "Nama kamu telah diubah menjadi",
      yenKurang: "Kamu tidak memiliki cukup yen untuk mengubah namamu ^_^"
    },
    en: {
      hadi: "You haven't given her id yet.",
      berhasil: "Your name has been changed to",
      yenKurang: "You don't have enough yen!"
    }
  },
  Ayanokoji: async function ({ api, event, args, bhs, getStream, loadC, setUser, getData }) {
    try {
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
        await setUser(event.senderID, "nama", namaBaru);
        await setUser(event.senderID, "yen", userData.yen - 0.5);
        api.sendMessage(` ${bhs.berhasil} ${namaBaru}.`, event.threadID);
      } else {
        api.sendMessage("Data pengguna tidak ditemukan", event.threadID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("Terjadi kesalahan", event.threadID);
    }
  }
};

async function getData(id) {
  const db = await fetchDatabase('users');
  const userData = db[id] || { nama: "Unknown", yen: 0, exp: 0, level: 1, daily: null, id: Object.keys(db).length + 1 };
  // Validasi data
  if (typeof userData.yen !== 'number' || typeof userData.exp !== 'number' || typeof userData.level !== 'number') {
    console.error("Data pengguna tidak valid:", userData);
    return null;
  }
  return userData;
}
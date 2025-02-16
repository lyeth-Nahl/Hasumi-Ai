module.exports = {
  hady: {
    nama: "setn",
    penulis: "",
    peran: 0,
    kuldown: 10,
    tutor: "<id>"
  },
  bahasa: {
    id: {
      hadi: "Kamu belum memberikan id nya."
    },
    en: {
      hadi: "You haven't given her id yet."
    }
  },
  Ayanokoji: async function ({ api, event, args, bhs }) {
    if (args.length === 0) {
      api.sendMessage(bhs.hadi, event.threadID);
      return;
    }
    const id = args[0];
    const userData = await getData(event.senderID);
    if (userData.yen < 0.5) {
      api.sendMessage("Yen kamu tidak cukup!", event.threadID);
      return;
    }
    // Kurangi yen pengguna
    setUser(event.senderID, "yen", userData.yen - 0.5);
    // Simpan nama baru ke database
    setUser(event.senderID, "nama", id);
    api.sendMessage(`Nama kamu telah diubah menjadi ${id}. Yen kamu telah dikurangi sebesar 0.5`, event.threadID);
  }
};
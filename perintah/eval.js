module.exports = {
  hady: {
    nama: "eval",
    penulis: "Horikita",
    kuldown: 0,
    peran: 2,
    tutor: "cmd [eval] <kode>"
  },
  Ayanokoji: async function({ api, event, args, bhs }) {
    if (args.length === 0) {
      return api.sendMessage("Tolong masukkan kode yang ingin dievaluasi!", event.threadID);
    }

    const kode = args.slice(1).join(" ");

    try {
      const hasil = eval(kode);
      api.sendMessage(`Hasil evaluasi: ${hasil}`, event.threadID);
    } catch (err) {
      api.sendMessage(`Error: ${err.message}`, event.threadID);
    }
  }
};
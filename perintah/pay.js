const fs = require('fs');

module.exports = {
  hady: {
    nama: "pay",
    penulis: "Horikita",
    kuldown: 0,
    peran: 0,
    tutor: "cmd [pay] <id_penerima> <jumlah_yen>"
  },
  Ayanokoji: async function ({ api, event, args, bhs }) {
    const statusPath = './status.json';
    let statusData = {};

    try {
      statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    } catch (err) {
      console.error(err);
    }

    if (args.length < 2) {
      return api.sendMessage("Tolong masukkan id penerima dan jumlah yen!", event.threadID);
    }

    const idPenerima = args[0];
    const jumlahYen = parseInt(args[1]);

    if (!statusData[event.senderID]) {
      return api.sendMessage("Anda belum memiliki akun!", event.threadID);
    }

    const penerima = Object.values(statusData).find((user) => user.id === parseInt(idPenerima));

    if (!penerima) {
      return api.sendMessage(`Penerima dengan id ${idPenerima} belum memiliki akun!`, event.threadID);
    }

    if (jumlahYen <= 0) {
      return api.sendMessage("Jumlah yen harus lebih besar dari 0!", event.threadID);
    }

    const pajak = jumlahYen * 0.155;
    const totalYen = jumlahYen - pajak;

    if (statusData[event.senderID].yen < jumlahYen) {
      return api.sendMessage("Anda tidak memiliki cukup yen!", event.threadID);
    }

    statusData[event.senderID].yen -= jumlahYen;
    penerima.yen += totalYen;

    fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));

    api.sendMessage(`Anda telah mengirim ${jumlahYen} yen kepada pengguna dengan id ${idPenerima}! Pajak 15.5% telah dipotong, sehingga pengguna tersebut menerima ${totalYen} yen.`, event.threadID);

    const notifikasi = `${statusData[event.senderID].nama} (#${statusData[event.senderID].id}) transfer ¥${jumlahYen} ke akun kamu.`;
    api.sendMessage(notifikasi, Object.keys(statusData).find((key) => statusData[key].id === parseInt(idPenerima)));
  }
};
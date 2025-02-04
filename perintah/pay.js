const fs = require('fs');

module.exports = {
  hady: {
    nama: "pay",
    penulis: "Horikita",
    kuldown: 0,
    peran: 0,
    tutor: "cmd [pay] <id_penerima> <total_yen>"
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
      return api.sendMessage("Tolong masukkan id penerima dan total yen!", event.threadID);
    }

    const idPenerima = args[0];
    const totalYen = parseInt(args[1]);

    if (!statusData[event.senderID]) {
      return api.sendMessage("Anda belum memiliki akun!", event.threadID);
    }

    if (!statusData[idPenerima]) {
      return api.sendMessage("Penerima belum memiliki akun!", event.threadID);
    }

    if (totalYen <= 0) {
      return api.sendMessage("Total yen harus lebih besar dari 0!", event.threadID);
    }

    if (statusData[event.senderID].yen < totalYen) {
      return api.sendMessage("Anda tidak memiliki cukup yen!", event.threadID);
    }

    statusData[event.senderID].yen -= totalYen;
    statusData[idPenerima].yen += totalYen;

    fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));

    api.sendMessage(`Anda telah mengirim ${totalYen} yen kepada ${idPenerima}!`, event.threadID);
  }
};
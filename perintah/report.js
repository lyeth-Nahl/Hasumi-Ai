const fs = require('fs');
const noah = JSON.parse(fs.readFileSync('kiyotaka.json', 'utf8'));

module.exports = {
  hady: {
    nama: "report",
    penulis: "Hady Zen",
    kuldown: 0,
    peran: 0,
    tutor: "cmd [report] <pesan_report> | [balas] <id_report> <pesan_balas>"
  },
  Ayanokoji: async function({ api, event, args, bhs }) {
    if (args[0] === "balas") {
      const idReport = args[1];
      const pesanBalas = args.slice(2).join(" ");
      if (!idReport || !pesanBalas) {
        return api.sendMessage("Tolong masukkan id report dan pesan balas!", event.threadID);
      }
      const balasMessage = `Balas From ${event.senderName} : ${pesanBalas}`;
      api.sendMessage(balasMessage, idReport);
      api.sendMessage("Balas telah dikirim ke pengguna!", event.threadID);
    } else {
      const pesanReport = args.join(" ");
      if (!pesanReport) {
        return api.sendMessage("Tolong masukkan pesan report!", event.threadID);
      }
      const reportMessage = `Report From ${event.senderName} : ${pesanReport}`;
      for (const admin of noah.admin) {
        api.sendMessage(reportMessage, admin);
      }
      api.sendMessage("Report telah dikirim ke admin bot!", event.threadID);
    }
  }
};
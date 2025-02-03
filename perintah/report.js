const fs = require('fs');
const noah = JSON.parse(fs.readFileSync('kiyotaka.json', 'utf8'));

module.exports = {
  hady: {
    nama: "report",
    penulis: "Hady Zen",
    kuldown: 0,
    peran: 0,
    tutor: "cmd [report] <pesan_report>"
  },
  Ayanokoji: async function({ api, event, args, bhs }) {
    const pesanReport = args.join(" ");
    if (!pesanReport) {
      return api.sendMessage("Tolong masukkan pesan report!", event.threadID);
    }
    const reportMessage = `Report From ${event.senderID} : ${pesanReport}`;
    for (const admin of noah.admin) {
      await api.sendMessage(reportMessage, admin);
    }
    return api.sendMessage("Report telah dikirim ke admin bot!", event.threadID);
  }
};
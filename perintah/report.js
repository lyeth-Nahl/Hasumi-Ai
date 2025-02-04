const fs = require('fs');
const noah = JSON.parse(fs.readFileSync('kiyotaka.json', 'utf8'));
const status = JSON.parse(fs.readFileSync('status.json', 'utf8'));

module.exports = {
hady: {
nama: "report",
penulis: "Horikita",
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
const namaPengguna = status[event.senderID] && status[event.senderID].nama ? status[event.senderID].nama : event.senderID;
const balasMessage = `Balas From ${event.senderID} (${namaPengguna}) : ${pesanBalas}`;
api.sendMessage(balasMessage, idReport);
api.sendMessage("Balas telah dikirim ke pengguna!", event.threadID);
} else {
const pesanReport = args.join(" ");
if (!pesanReport) {
return api.sendMessage("Tolong masukkan pesan report!", event.threadID);
}
const namaPengguna = status[event.senderID] && status[event.senderID].nama ? status[event.senderID].nama : event.senderID;
const reportMessage = `Report From ${event.senderID} (${namaPengguna}) : ${pesanReport}`;
for (const admin of noah.admin) {
api.sendMessage(reportMessage, admin);
}
api.sendMessage("Report telah dikirim ke admin bot!", event.threadID);
}
}
};
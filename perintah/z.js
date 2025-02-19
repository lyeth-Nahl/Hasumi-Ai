const moment = require('moment');
const packageJson = require('../package.json');

module.exports = {
  hady: {
    nama: "z",
    penulis: "Nahl",
    kuldown: 0,
    peran: 0,
    tutor: ""
  },
  Ayanokoji: async function({ api, event, args, bhs, getStream, loadC, setUser, getData, addThread, unregistThread, banUser, unbanUser, isThreadRegistered, fetchDatabase }) {
    try {
      const db = await fetchDatabase('users');
      const jumlahUser = Object.keys(db).length;
      const jumlahUserBanned = Object.keys(db).filter(id => db[id].banned).length;
      const jumlahGrup = await fetchDatabase('threads');
      const jumlahGrupRegistered = Object.keys(jumlahGrup).filter(id => jumlahGrup[id].registered).length;
      const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
      const startTime = process.uptime() * 1000;
      const uptime = moment().diff(startTime);
      const uptimeFormat = moment.utc(uptime).format('D [hari], H [jam], m [menit], s [detik]');
      const versiBot = packageJson.version;
      const nodeVersi = process.version;
      const platform = process.platform;
      const arch = process.arch;
      const cpuCount = require('os').cpus().length;
      const tanggalWaktu = moment().format('DD MMMM YYYY HH:mm:ss');

      const message = ` Statistik Bot:\n\n` +
        ` Tanggal Waktu: ${tanggalWaktu}\n` +
        ` Jumlah User: ${jumlahUser}\n` +
        ` Jumlah User Banned: ${jumlahUserBanned}\n` +
        ` Jumlah Grup Registered: ${jumlahGrupRegistered}\n` +
        ` Memory Usage: ${memoryUsage.toFixed(2)} MB\n` +
        ` Uptime: ${uptimeFormat}\n` +
        ` Versi Bot: ${versiBot}\n` +
        ` Node.js Versi: ${nodeVersi}\n` +
        ` Platform: ${platform}\n` +
        ` Arsitektur: ${arch}\n` +
        ` Jumlah Core CPU: ${cpuCount}`;

      return api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error("Gagal mengambil statistik bot:", error);
      return api.sendMessage("Gagal mengambil statistik bot.", event.threadID);
    }
  }
};
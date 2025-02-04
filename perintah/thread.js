const api = require('api-bot');

module.exports = {
  hady: {
    nama: "thread",
    penulis: "Horikita",
    kuldown: 0,
    peran: 0,
    tutor: "cmd [thread]"
  },
  Ayanokoji: async function({ api, event, args, bhs }) {
    try {
      const threadList = await api.getThreadList();
      const listGrup = threadList.map((thread) => `Nama Grup: ${thread.name}\nID Grup: ${thread.threadID}\nJumlah Anggota: ${thread.participantIDs.length}`).join("\n\n");
      api.sendMessage(listGrup, event.threadID);
    } catch (err) {
      api.sendMessage(`Error: ${err.message}`, event.threadID);
    }
  }
};
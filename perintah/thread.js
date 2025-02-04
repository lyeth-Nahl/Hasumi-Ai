module.exports = {
  hady: {
    nama: "thread",
    penulis: "Horikita",
    kuldown: 0,
    peran: 0,
    tutor: "cmd [thread]"
  },
  Ayanokoji: async function({ api, event, args, bhs }) {
    const threadList = await api.getAllThread();
    let listGrup = "";
    for (const thread of threadList) {
      listGrup += `Nama Grup: ${thread.name}\nID Grup: ${thread.threadID}\nJumlah Anggota: ${thread.participantIDs.length}\n\n`;
    }
    api.sendMessage(listGrup, event.threadID);
  }
};
module.exports = {
  hady: {
    nama: "nya-dm",
    penulis: "Hady Zen",
    kuldown: 0,
    peran: 0,
    tutor: ""
  },
  Ayanokoji: async function({ api, event }) {
    api.sendMessage("Nya.", event.threadID);
    api.sendMessage("Nyaw.", event.senderID);
  }
};
module.exports = { 
hady: { 
  nama: "kick",
  penulis: "Hady Zen", 
  kuldown: 10,
  peran: 1,
  tutor: "<id>"
}, 

bahasa: {
  id: { hadi: "Kamu belum memasukkan id nya." }, 
  en: { hadi: "You haven't given her id yet." }
}, 
  
Ayanokoji: async function ({ api, event, args, bhs }) {
  if (args[0]) {
    return api.removeUserFromGroup(args[0], event.threadID);
  } else {
    api.sendMessage(bhs('hadi'), event.threadID, event.messageID);
  }
 }
};
const evalCmd = {
  nama: "eval",
  penulis: "Horikita",
  kuldown: 5,
  peran: 2,
  tutor: "eval <kode>"
};

evalCmd.exec = async function ({ api, event, args, bhs }) {
  if (!args.join(' ')) return api.sendMessage("Masukkan kode yang ingin dieval!", event.threadID, event.messageID);
  try {
    const hasil = eval(args.join(' '));
    api.sendMessage(`Hasil eval: ${hasil}`, event.threadID, event.messageID);
  } catch (err) {
    api.sendMessage(`Error eval: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports = evalCmd;
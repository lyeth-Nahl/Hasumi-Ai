const fs = require('fs');

const path = require('path');

module.exports = {

  hady: {

    nama: "cmd",

    penulis: "Horikita",

    kuldown: 5,

    peran: 0,

    tutor: "cmd [install|del|load|loadall] [nama perintah]"

  },

  Ayanokoji: async function ({ api, event, args, client, __ }) {

    const dirCmd = __dirname + "/";

    if (args[0] === "install") {

      const namaCmd = args[1];

      if (!namaCmd) return api.sendMessage("Masukkan nama perintah yang ingin diinstal!", event.threadID, event.messageID);

      const filePath = dirCmd + namaCmd + ".js";

      const kodeBaru = args.slice(2).join(" ");

      fs.writeFileSync(filePath, kodeBaru);

      api.sendMessage(`Perintah ${namaCmd} berhasil diinstal!`, event.threadID, event.messageID);

    } else if (args[0] === "del") {

      const namaCmd = args[1];

      if (!namaCmd) return api.sendMessage("Masukkan nama perintah yang ingin dihapus!", event.threadID, event.messageID);

      const filePath = dirCmd + namaCmd + ".js";

      if (!fs.existsSync(filePath)) return api.sendMessage("Perintah tidak terinstal!", event.threadID, event.messageID);

      try {

        fs.unlinkSync(filePath);

        api.sendMessage(`Perintah ${namaCmd} berhasil dihapus!`, event.threadID, event.messageID);

      } catch (err) {

        api.sendMessage(`Gagal menghapus perintah ${namaCmd}!`, event.threadID, event.messageID);

      }

    } else if (args[0] === "load") {

      const namaCmd = args[1];

      if (!namaCmd) return api.sendMessage("Masukkan nama perintah yang ingin dimuat!", event.threadID, event.messageID);

      const filePath = dirCmd + namaCmd + ".js";

      if (!fs.existsSync(filePath)) return api.sendMessage("Perintah tidak terinstal!", event.threadID, event.messageID);

      try {

        const cmd = require(path.join(dirCmd, namaCmd + ".js"));

        api.sendMessage(`Perintah ${namaCmd} berhasil dimuat!`, event.threadID, event.messageID);

      } catch (err) {

        api.sendMessage(`Gagal memuat perintah ${namaCmd}!\nError: ${err.message}`, event.threadID, event.messageID);

      }

    } else if (args[0] === "loadall") {

      const listCmd = fs.readdirSync(dirCmd).filter(file => file.endsWith(".js"));

      let msg = "Memuat semua perintah...\n";

      for (const file of listCmd) {

        try {

          const cmd = require(path.join(dirCmd, file));

          msg += `• ${file.replace(".js", "")} berhasil dimuat!\n`;

        } catch (err) {

          msg += `• ${file.replace(".js", "")} gagal dimuat!\nError: ${err.message}\n`;

        }

      }

      api.sendMessage(msg, event.threadID, event.messageID);

    }

  }

};
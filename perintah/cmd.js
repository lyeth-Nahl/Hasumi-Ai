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

    const dirCmd = __dirname + "/commands/";

    if (args[0] === "install") {

      const namaCmd = args[1];

      if (!namaCmd) return api.sendMessage("Masukkan nama perintah yang ingin diinstal!", event.threadID, event.messageID);

      const filePath = dirCmd + namaCmd + ".js";

      const kodeBaru = args.slice(2).join(" ");

      const msg = await api.sendMessage(`Anda yakin ingin menginstal kode baru untuk perintah ${namaCmd}?`, event.threadID, event.messageID);

      await api.react(msg.messageID, "✅", (err) => {

        if (err) return console.error(err);

      });

      await api.react(msg.messageID, "❌", (err) => {

        if (err) return console.error(err);

      });

      const reaksi = await api.getReaction(msg.messageID);

      if (reaksi && reaksi.reaction === "✅") {

        fs.writeFileSync(filePath, kodeBaru);

        api.sendMessage(`Perintah ${namaCmd} berhasil diinstal!`, event.threadID, event.messageID);

      } else {

        api.sendMessage("Instalasi kode baru dibatalkan!", event.threadID, event.messageID);

      }

    } else if (args[0] === "del") {

      const namaCmd = args[1];

      if (!namaCmd) return api.sendMessage("Masukkan nama perintah yang ingin dihapus!", event.threadID, event.messageID);

      const filePath = dirCmd + namaCmd + ".js";

      if (!fs.existsSync(filePath)) return api.sendMessage("File tidak ada!", event.threadID, event.messageID);

      const msg = await api.sendMessage(`Anda yakin ingin menghapus perintah ${namaCmd}?`, event.threadID, event.messageID);

      await api.react(msg.messageID, "✅", (err) => {

        if (err) return console.error(err);

      });

      const reaksi = await api.getReaction(msg.messageID);

      if (reaksi && reaksi.reaction === "✅") {

        try {

          fs.unlinkSync(filePath);

          api.sendMessage(`Perintah ${namaCmd} berhasil dihapus!`, event.threadID, event.messageID);

        } catch (err) {

          api.sendMessage(`Gagal menghapus perintah ${namaCmd}!\nError: ${err.message}`, event.threadID, event.messageID);

        }

      } else {

        api.sendMessage("Penghapusan perintah dibatalkan!", event.threadID, event.messageID);

      }

    } else if (args[0] === "load") {

      const namaCmd = args[1];

      if (!namaCmd) return api.sendMessage("Masukkan nama perintah yang ingin dimuat!", event.threadID, event.messageID);

      const filePath = dirCmd + namaCmd + ".js";

      if (!fs.existsSync(filePath)) return api.sendMessage("File tidak ada!", event.threadID, event.messageID);

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
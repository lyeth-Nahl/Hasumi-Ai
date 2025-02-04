const fs = require('fs/promises');
const path = require('path');

module.exports = {
  hady: {
    nama: "menu",
    penulis: "Hady Zen",
    peran: 0,
    kuldown: 10,
    tutor: "<cmd/kosong>"
  },
  Ayanokoji: async function ({ api, event, args }) {
    const files = await fs.readdir(path.join('./perintah'));
    const jsFiles = files.filter(file => path.extname(file) === '.js');
    jsFiles.sort();
    const commandList = [];
    const commandInfo = {};

    for (const file of jsFiles) {
      const filePath = path.join(path.join('./perintah'), file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      let configMatch = fileContent.match(/const\s+hady\s*=\s*{[^}]*nama\s*:\s*"([^"]+)"/);
      if (!configMatch) {
        configMatch = fileContent.match(/hady\s*:\s*{[^}]*nama\s*:\s*"([^"]+)"/);
      }
      if (configMatch) {
        const commandName = configMatch[1];
        let configObj = fileContent.match(/const\s+hady\s*=\s*{([^}]+)}/);
        if (!configObj) {
          configObj = fileContent.match(/hady\s*:\s*{([^}]+)}/);
        }
        if (configObj) {
          const configData = configObj[1].split(',').reduce((acc, line) => {
            const [key, value] = line.split(':').map(str => str.trim().replace(/"/g, ''));
            acc[key] = value;
            return acc;
          }, {});
          commandInfo[commandName] = configData;
          if (configData.peran == 0) {
            commandList.push(commandName);
          } else if (configData.peran == 2 && event.participantIDs.includes(event.admin)) {
            commandList.push(commandName);
          } else if (configData.peran == 3 && event.participantIDs.includes(event.botAdmin)) {
            commandList.push(commandName);
          }
        }
      }
    }

    if (args[0] && commandInfo[args[0]]) {
      const info = commandInfo[args[0]];
      api.sendMessage(`
        📚 Informasi Perintah 📚
        Nama: ${info.nama}
        Penulis: ${info.penulis}
        Peran: ${info.peran}
        Kuldown: ${info.kuldown} detik
        Tutorial: ${global.Ayanokoji.awalan}${args[0]} ${info.tutor}
      `, event.threadID, event.messageID);
    } else if (args[0] && !commandInfo[args[0]]) {
      api.sendMessage(`Perintah ${args[0]} tidak ada.`, event.threadID, event.messageID);
    } else if (!args[0]) {
      api.sendMessage(`
        📚 Daftar Perintah 📚
        ${commandList.map(command => `• ${command}`).join('\n')}
      `, event.threadID, event.messageID);
    }
  }
};
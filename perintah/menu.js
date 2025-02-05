const fs = require('fs/promises');
const path = require('path');

module.exports = {
  hady: {
    nama: "menu",
    penulis: "Edinst",
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
╭──「 🛠️ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢  🛠️ 」───
│ 📝 𝗡𝗮𝗺𝗮: ${info.nama}
│ ✍️ 𝗣𝗲𝗻𝘂𝗹𝗶𝘀: ${info.penulis}
│ 🔐 𝗣𝗲𝗿𝗮𝗻: ${info.peran === '0' ? 'Pengguna' : info.peran === '2' ? 'Admin' : 'Super Admin'}
│ ⏳ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${info.kuldown} detik
│ 
│ 📖 𝗧𝘂𝘁𝗼𝗿𝗶𝗮𝗹:
│ ${global.Ayanokoji.awalan}${args[0]} ${info.tutor}
╰───────────────────────
      `.trim(), event.threadID, event.messageID);
    } else if (args[0] && !commandInfo[args[0]]) {
      api.sendMessage(`❌ 𝗘𝗥𝗥𝗢𝗥 ❌
━━━━━━━━━━━━━━━━━━━
Command "${args[0]}" tidak ditemukan!
Ketik ${global.Ayanokoji.awalan}menu untuk melihat daftar command`, event.threadID, event.messageID);
    } else if (!args[0]) {
      api.sendMessage(`
╭──「 📦 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧 」───
│ Total ${commandList.length} commands available
│ 
│ ${commandList.map((command, index) => `├ ${index + 1}. ${command}`).join('\n│ ')}
│ 
│ 🧩 𝗧𝗶𝗽: Ketik ${global.Ayanokoji.awalan}menu <command> 
│       untuk melihat info lengkap
╰───────────────────────
      `.trim().replace(/│ /g, '│'), event.threadID, event.messageID);
    }
  }
};
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
        if (args[0] && args[0] === commandName) {
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
          }
          break; 
        } else {
          commandList.push(commandName); 
        }
      }
    }

    if (args[0] && commandInfo[args[0]]) {
      const info = commandInfo[args[0]];
      api.sendMessage(`🜲 𝗜𝗻𝗳𝗼 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵
      
- Nama: ${info.nama}
- Penulis: ${info.penulis}
- Peran: ${info.peran}
- Kuldown: ${info.kuldown} detik
- Tutorial: ${global.Ayanokoji.awalan}${args[0]} ${info.tutor}`, event.threadID, event.messageID);
    } else if (args[0] && !commandInfo[args[0]]) { 
      api.sendMessage(`Perintah ${args[0]} tidak ada.`, event.threadID, event.messageID);
    } else if (!args[0]) {
      api.sendMessage(`🜲 𝗗𝗮𝗳𝘁𝗮𝗿 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵

${commandList.join('\n')}`, event.threadID, event.messageID);
  }
 }
};
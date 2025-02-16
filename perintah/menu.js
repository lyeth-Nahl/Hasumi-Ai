const fs = require('fs');
const path = require('path');

module.exports = {
  hady: {
    nama: "help",
    penulis: "Edinst",
    peran: 0,
    kuldown: 10,
    tutor: ".help <perintah>"
  },
  Ayanokoji: async function ({ api, event, args }) {
    try {
      if (args[0]) {
        // Cari file perintah
        const perintah = args[0].toLowerCase();
        const filePath = path.join(__dirname, '../perintah', `${perintah}.js`);
        
        // Baca file dan dapatkan konfigurasi
        if (fs.existsSync(filePath)) {
          const fileContent = await fs.promises.readFile(filePath, 'utf-8');
          const configMatch = fileContent.match(/const\s+hady\s*=\s*{([^}]+)}/);
          
          if (configMatch) {
            // Parse konfigurasi
            const configData = configMatch[1].split(',').reduce((acc, line) => {
              const [key, value] = line.split(':').map(str => str.trim().replace(/"/g, ''));
              acc[key] = value;
              return acc;
            }, {});
            
            // Kirim pesan help
            const helpMessage = ` 
𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘀𝗶 𝗣𝗲𝗿𝗶𝗻𝘁𝗮𝗵
Perintah ${perintah}.
• 𝗡𝗮𝗺𝗮: ${configData.nama}
• 𝗛𝗮𝗿𝗴𝗮: ${configData.harga}
• 𝗔𝗿𝗴𝘂𝗺𝗲𝗻 
 - 𝗣𝗲𝗻𝗴𝗴𝘂𝗻𝗮𝗮𝗻: ${configData.argumen}
 - 𝗣𝗮𝗿𝗮𝗺𝘀: ${configData.params}
• 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${configData.kuldown} detik.
• 𝗦𝗶𝗻𝘁𝗮𝗸𝘀: ${configData.tutor}
`;
            api.sendMessage(helpMessage, event.threadID, event.messageID);
          } else {
            api.sendMessage(`Perintah ${perintah} tidak memiliki konfigurasi yang valid!`, event.threadID, event.messageID);
          }
        } else {
          api.sendMessage(`Perintah ${perintah} tidak ditemukan!`, event.threadID, event.messageID);
        }
      } else {
        // Dapatkan daftar perintah
        const files = await fs.promises.readdir(path.join(__dirname, '../perintah'));
        const jsFiles = files.filter(file => path.extname(file) === '.js');
        const perintahList = jsFiles.map(file => file.replace('.js', ''));
        
        // Kirim pesan help
        const helpMessage = ` 
𝗗𝗮𝗳𝘁𝗮𝗿 𝗣𝗲𝗿𝗶𝗻𝘁𝗮𝗵
Berikut adalah daftar perintah yang tersedia:
${perintahList.join('\n')}
Gunakan .help <perintah> untuk melihat informasi lebih lanjut tentang perintah tersebut.
`;
        api.sendMessage(helpMessage, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage('Terjadi kesalahan saat memuat help', event.threadID, event.messageID);
    }
  }
};
module.exports = {
  hady: {
    nama: "imgbb",
    penulis: "Nahl",
    kuldown: 0,
    peran: 0,
    tutor: ""
  },
  Ayanokoji: async function({ api, event }) {
    const axios = require('axios');
    const apiKey = 'fce149ef95e0734793caf895d94c8362';

    if (event.type === 'message') {
      const args = event.body.split(' ');
      if (args[0].toLowerCase() === 'imgbb') {
        api.sendMessage('Silakan kirimkan gambar yang ingin diunggah!', event.threadID);

        // Mendeteksi gambar yang dikirimkan
        if (event.message.attachments.length > 0) {
          const attachment = event.message.attachments[0];
          const imageData = attachment.url;

          axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            image: imageData
          })
          .then(response => {
            const imageUrl = response.data.data.url;
            api.sendMessage(`Gambar berhasil diunggah! ${imageUrl}`, event.threadID);
          })
          .catch(error => {
            api.sendMessage(`Gagal mengunggah gambar! ${error.message}`, event.threadID);
          });
        }
      }
    }
  }
};
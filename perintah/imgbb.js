const fs = require('fs');
const axios = require('axios');

module.exports = {
  hady: {
    nama: "imgbb",
    penulis: "Horikita",
    kuldown: 10,
    peran: 0,
    tutor: "Unggah gambar ke ImgBB"
  },
  Ayanokoji: async function ({ api, event }) {
    if (event.message.attachments.length > 0) {
      const attachment = event.message.attachments[0];
      if (attachment.type === 'photo') {
        const formData = new FormData();
        formData.append('image', await api.downloadAttachment(attachment));
        axios.post('https://api.imgbb.com/1/upload?key=fce149ef95e0734793caf895d94c8362', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          const link = res.data.data.url;
          api.sendMessage(`Link ImgBB: ${link}`, event.threadID, event.messageID);
        })
        .catch(err => {
          api.sendMessage('Gagal mengunggah gambar!', event.threadID, event.messageID);
        });
      } else {
        api.sendMessage('Tipe lampiran tidak didukung!', event.threadID, event.messageID);
      }
    } else {
      api.sendMessage('Tidak ada lampiran!', event.threadID, event.messageID);
    }
  }
};
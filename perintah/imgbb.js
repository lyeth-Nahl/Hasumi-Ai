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

Ayanokoji: async function ({ api, event, args }) {

if (args[0] === 'imgbb') {

const imagePath = args[1];

if (!imagePath) {

return api.sendMessage('Masukkan path ke gambar!', event.threadID, event.messageID);

}

const formData = new FormData();

formData.append('image', fs.createReadStream(imagePath));

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

}

}

};
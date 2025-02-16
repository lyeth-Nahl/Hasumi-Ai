module.exports = {
hady: {
nama: "setn",
penulis: "kiel",
peran: 0,
kuldown: 10,
tutor: "<id>"
},
Ayanokoji: async function ({ api, event, args, getStream, loadC, setUser, getData }) {
try {
if (args.length === 0) {
api.sendMessage("Kamu belum memberikan nama baru!", event.threadID);
return;
}
const namaBaru = args.join(" ");
const userData = await getData(event.senderID);
if (userData) {
if (userData.yen < 0.5) {
api.sendMessage("Kamu tidak memiliki cukup yen untuk mengubah namamu ^_^", event.threadID);
return;
}
await setUser(event.senderID, "nama", namaBaru);
await setUser(event.senderID, "yen", userData.yen - 0.5);
api.sendMessage(`Nama kamu telah di ubah menjadi: ${namaBaru}.`, event.threadID);
} else {
api.sendMessage("Data pengguna tidak ditemukan", event.threadID);
}
} catch (error) {
console.error(error);
api.sendMessage("Terjadi kesalahan", event.threadID);
}
}
};

async function getData(id) {
const db = await fetchDatabase('users');
const userData = db[id] || { nama: "Unknown", yen: 0, exp: 0, level: 1, daily: null, id: Object.keys(db).length + 1 };
// Validasi data
if (typeof userData.yen !== 'number' || typeof userData.exp !== 'number' || typeof userData.level !== 'number') {
console.error("Data pengguna tidak valid:", userData);
return null;
}
return userData;
}
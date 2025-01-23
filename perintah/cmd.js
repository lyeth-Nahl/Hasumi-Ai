module.exports = {
hady: {
nama: "cmd",
penulis: "Ayanokoji-Kiyotaka",
kuldown: 5,
peran: 0,
tutor: "cmd [install|uninstall|load] [nama perintah]"
},
Ayanokoji: async function ({ api, event, args, client, __ }) {
const dirCmd = __dirname + "/commands/";

if (args[0] === "install") {
const namaCmd = args[1];
if (!namaCmd) return api.sendMessage("Masukkan nama perintah yang ingin diinstal!", event.threadID, event.messageID);

const filePath = dirCmd + namaCmd + ".js";
if (fs.existsSync(filePath)) return api.sendMessage("Perintah sudah terinstal!", event.threadID, event.messageID);

try {
const cmd = require(path.join(dirCmd, namaCmd + ".js"));
api.sendMessage(`Perintah ${namaCmd} berhasil diinstal!`, event.threadID, event.messageID);
} catch (err) {
api.sendMessage(`Gagal menginstal perintah ${namaCmd}!`, event.threadID, event.messageID);
}
} else if (args[0] === "uninstall") {
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
api.sendMessage(`Gagal memuat perintah ${namaCmd}!`, event.threadID, event.messageID);
}
} else {
api.sendMessage("Masukkan perintah yang valid!", event.threadID, event.messageID);
}
}
};
module.exports = {
hady: {
nama: "top",
penulis: "Horikita",
kuldown: 0,
peran: 0,
tutor: "cmd [top] <yen|exp|level>"
},
Ayanokoji: async function({ api, event, args, bhs }) {
const status = JSON.parse(fs.readFileSync('status.json', 'utf8'));
if (args.length === 0) {
return api.sendMessage("Tolong masukkan jenis top yang ingin ditampilkan (yen, exp, atau level)!", event.threadID);
}
const jenisTop = args[0].toLowerCase();
if (jenisTop !== "yen" && jenisTop !== "exp" && jenisTop !== "level") {
return api.sendMessage("Jenis top tidak valid! Tolong masukkan yen, exp, atau level.", event.threadID);
}
const dataTop = Object.values(status).sort((a, b) => b[jenisTop] - a[jenisTop]).slice(0, 10);
const topMessage = `Top ${jenisTop.charAt(0).toUpperCase() + jenisTop.slice(1)}:\n${dataTop.map((data, index) =>`${index + 1}. ${data.nama} - ${data[jenisTop]}`).join("\n")}`;
api.sendMessage(topMessage, event.threadID);
}
};
module.exports = {
  hady: {
    nama: "daily",
    penulis: "Kiel",
    kuldown: 5,
    peran: 0,
    tutor: ""
  },
  Ayanokoji: async function ({ api, event, getData }) {
    // Mendapatkan data user
    const userData = await getData(event.senderID);

    // Membuat pendapatan harian
    const pendapatanYen = Math.floor(Math.random() * 1000) + 500; // 500-1500 yen
    const pendapatanExp = Math.floor(Math.random() * 50) + 10; // 10-60 exp

    // Menambahkan pendapatan ke data user
    userData.yen += pendapatanYen;
    userData.exp += pendapatanExp;

    // Menyimpan perubahan data user
    await api.setData(event.senderID, userData);

    // Mengirimkan pesan konfirmasi
    return `Selamat! Anda mendapatkan ${pendapatanYen} yen dan ${pendapatanExp} exp sebagai hadiah harian!`;
  }
};
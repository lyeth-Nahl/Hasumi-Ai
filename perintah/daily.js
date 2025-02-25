module.exports = {
  hady: {
    nama: "daily",
    penulis: "Kiel",
    kuldown: 5,
    peran: 0,
    tutor: ""
  },
  Ayanokoji: async function ({ api, event, getData, setUser }) {
    // Mendapatkan data user
    const userData = await getData(event.senderID);

    // Membuat pendapatan harian
    const pendapatanYen = Math.floor(Math.random() * 50) + 1; // 50-150 yen
    const pendapatanExp = Math.floor(Math.random() * 50) + 10; // 10-60 exp

    // Menambahkan pendapatan ke data user
    userData.yen = (userData.yen || 0) + pendapatanYen;
    userData.exp = (userData.exp || 0) + pendapatanExp;

    // Menyimpan perubahan data user
    await setUser(event.senderID, userData);

    // Mengirimkan pesan konfirmasi
    return `Selamat! Anda mendapatkan ${pendapatanYen} yen dan ${pendapatanExp} exp sebagai hadiah harian!`;
  }
};
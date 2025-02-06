module.exports = {
  hady: {
    nama: "restart",
    penulis: "Nahl",
    kuldown: 0,
    peran: 0,
    tutor: ""
  },
  Ayanokoji: async function({ api, event }) {
    const startTime = new Date().getTime();
    console.log('Restarting...');
    setTimeout(() => {
      const endTime = new Date().getTime();
      const restartTime = (endTime - startTime) / 1000;
      console.log(`Bot telah restart dalam ${restartTime} detik.`);
      process.exit(0);
    }, 1000);
  }
};
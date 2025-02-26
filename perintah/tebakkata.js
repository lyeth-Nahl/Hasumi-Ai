let isPlaying = false;

module.exports = {
  hady: {
    nama: "tebakkata",
    penulis: "kiel",
    peran: 0,
    kuldown: 10,
    tutor: "<id>"
  },
  Ayanokoji: async function ({ api, event, args, getStream, loadC, setUser, getData, userData }) {
    const user = event.senderID;
    const kata = ["kelinci", "kucing", "anjing"];
    const nyawa = 5;
    const hint = 3;
    const skip = 4;
    const jawabanBenar = 0;
    let yen = 0;

    if (isPlaying) {
      api.sendMessage("Kamu sedang bermain, tunggu sampai permainan selesai!", user);
      return;
    }

    isPlaying = true;

    if (userData && userData[user]) {
      yen = userData[user].yen;
    }

    api.sendMessage(`Selamat datang di permainan tebak kata!

_Kata: _ _ _ _ _
_Nyawa: ${nyawa}_
_Hint: ${hint}_
_Skip: ${skip}_

Masukkan jawabanmu!`, user);

    api.listen('message', (message) => {
      if (message.senderID === user) {
        const tebakan = message.body.toLowerCase();

        if (tebakan === 'skip') {
          if (skip > 0) {
            skip--;
            api.sendMessage(`Kamu melewati kata ini! Skip tersisa: ${skip}`, user);
          } else {
            api.sendMessage('Maaf, skip sudah habis! Permainan berakhir.', user);
            isPlaying = false;
          }
        } else if (tebakan === 'hint') {
          api.sendMessage(`Hint: ${kata[0].length} huruf`, user);
        } else if (tebakan.length === 1) {
          // Tebakan adalah huruf
          let kataTebak = '';
          let benar = false;

          for (let i = 0; i < kata[0].length; i++) {
            if (kata[0][i] === tebakan) {
              kataTebak += tebakan;
              benar = true;
            } else {
              kataTebak += '_';
            }
          }

          if (benar) {
            jawabanBenar++;
            api.sendMessage(`Huruf benar! Jawaban benar: ${jawabanBenar}`, user);
          } else {
            nyawa--;
            api.sendMessage(`Huruf salah! Nyawa: ${nyawa}`, user);
          }

          api.sendMessage(`_Kata: ${kataTebak}_
_Nyawa: ${nyawa}_
_Hint: ${hint}_
_Skip: ${skip}_`, user);
        } else {
          // Tebakan adalah kata
          if (tebakan === kata[0]) {
            jawabanBenar++;
            api.sendMessage(`Kamu menang! Jawaban benar: ${jawabanBenar}`, user);
            if (jawabanBenar === 1) {
              yen += 3;
            } else {
              yen += jawabanBenar * 3;
            }
            api.sendMessage(`Kamu mendapatkan ${yen} yen!`, user);
            // Simpan data user
            if (!userData[user]) {
              userData[user] = {};
            }
            userData[user].yen = yen;
            isPlaying = false;
          } else {
            nyawa--;
            api.sendMessage(`Kata salah! Nyawa: ${nyawa}`, user);
          }
        }

        if (nyawa === 0 || skip === 0) {
          isPlaying = false;
          api.sendMessage('Maaf, kamu kalah! Nyawa habis atau skip sudah habis. Permainan berakhir.', user);
        }
      }
    });
  }
};
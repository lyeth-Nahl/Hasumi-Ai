module.exports = {
  hady: {
    nama: "c",
    penulis: "Horikita",
    kuldown: 0,
    peran: 2,
    tutor: "cmd [hasumi] <sub-cmd> [args]"
  },
  Ayanokoji: async function({ api, args, event, client }) {
    const subCmd = args[0];
    const userId = args[1];
    const threadId = event.threadID;

    switch (subCmd) {
      case "ban":
        if (!userId) return api.sendMessage("Masukkan ID user yang ingin diban!", threadId);
        const banUser = await banUser(userId);
        if (banUser) {
          api.sendMessage(`User ${userId} berhasil diban!`, threadId);
        } else {
          api.sendMessage(`Gagal memban user ${userId}!`, threadId);
        }
        break;

      case "unban":
        if (!userId) return api.sendMessage("Masukkan ID user yang ingin di-unban!", threadId);
        const unbanUser = await unbanUser(userId);
        if (unbanUser) {
          api.sendMessage(`User ${userId} berhasil di-unban!`, threadId);
        } else {
          api.sendMessage(`Gagal meng-unban user ${userId}!`, threadId);
        }
        break;

      case "regist":
        if (!threadId) return api.sendMessage("Masukkan ID grup yang ingin diregistrasi!", threadId);
        const registThread = await addThread(threadId, event.senderID);
        if (registThread) {
          api.sendMessage(`Grup ${threadId} berhasil diregistrasi!`, threadId);
        } else {
          api.sendMessage(`Gagal meregistrasi grup ${threadId}!`, threadId);
        }
        break;

      case "unregist":
        if (!threadId) return api.sendMessage("Masukkan ID grup yang ingin di-unregist!", threadId);
        const unregistThread = await unregistThread(threadId);
        if (unregistThread) {
          api.sendMessage(`Grup ${threadId} berhasil di-unregist!`, threadId);
        } else {
          api.sendMessage(`Gagal meng-unregist grup ${threadId}!`, threadId);
        }
        break;

      case "info":
        if (!userId) return api.sendMessage("Masukkan ID user yang ingin dilihat info-nya!", threadId);
        const userData = await getData(userId);
        if (userData) {
          api.sendMessage(`Info User ${userId}:\nNama: ${userData.nama}\nYen: ${userData.yen}\nExp: ${userData.exp}\nLevel: ${userData.level}`, threadId);
        } else {
          api.sendMessage(`User ${userId} tidak ditemukan!`, threadId);
        }
        break;

      case "infogrup":
        if (!threadId) return api.sendMessage("Masukkan ID grup yang ingin dilihat info-nya!", threadId);
        const threadData = await getThreadData(threadId);
        if (threadData) {
          api.sendMessage(`Info Grup ${threadId}:\nNama Grup: ${threadData.nama}\nID Grup: ${threadData.id}\nJumlah Member: ${threadData.member.length}\nDaftar Member: ${threadData.member.join(", ")}`, threadId);
        } else {
          api.sendMessage(`Grup ${threadId} tidak ditemukan!`, threadId);
        }
        break;

      default:
        api.sendMessage("Sub-cmd tidak valid! Gunakan salah satu dari: ban, unban, regist, unregist, info, infogrup", threadId);
        break;
    }
  }
};
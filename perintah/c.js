module.exports = {
  hady: {
    nama: "c",
    penulis: "Horikita",
    kuldown: 0,
    peran: 2,
    tutor: "cmd [hasumi] <sub-cmd> [args]"
  },
  Ayanokoji: async function({ api, args, event, addThread, unregistThread, banUser, unbanUser, isThreadRegistered }) {
    const subCmd = args[0];
    const userId = args[1];
    const threadId = event.threadID;

    switch (subCmd) {
      case "ban":
        if (!userId) return api.sendMessage("Masukkan ID user yang ingin diban!", threadId);
        const banResult = await banUser(userId);
        if (banResult) {
          api.sendMessage(`User ${userId} berhasil diban!`, threadId);
        } else {
          api.sendMessage(`Gagal memban user ${userId}!`, threadId);
        }
        break;

      case "unban":
        if (!userId) return api.sendMessage("Masukkan ID user yang ingin di-unban!", threadId);
        const unbanResult = await unbanUser(userId);
        if (unbanResult) {
          api.sendMessage(`User ${userId} berhasil di-unban!`, threadId);
        } else {
          api.sendMessage(`Gagal meng-unban user ${userId}!`, threadId);
        }
        break;

      case "regist":
        if (!threadId) return api.sendMessage("Masukkan ID grup yang ingin diregistrasi!", threadId);
        const registResult = await addThread(threadId, event.senderID);
        if (registResult) {
          api.sendMessage(`Grup ${threadId} berhasil diregistrasi!`, threadId);
        } else {
          api.sendMessage(`Gagal meregistrasi grup ${threadId}!`, threadId);
        }
        break;

      case "unregist":
        if (!threadId) return api.sendMessage("Masukkan ID grup yang ingin di-unregist!", threadId);
        const unregistResult = await unregistThread(threadId);
        if (unregistResult) {
          api.sendMessage(`Grup ${threadId} berhasil di-unregist!`, threadId);
        } else {
          api.sendMessage(`Gagal meng-unregist grup ${threadId}!`, threadId);
        }
        break;

      default:
        api.sendMessage("Sub-cmd tidak valid! Gunakan salah satu dari: ban, unban, regist, unregist", threadId);
        break;
    }
  }
};
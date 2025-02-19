module.exports = {
  hady: {
    nama: "c",
    penulis: "Horikita",
    kuldown: 0,
    peran: 2, // Hanya admin yang bisa menggunakan perintah ini
    tutor: "cmd <sub-cmd> [args]\nContoh: cmd ban 123456789"
  },
  Ayanokoji: async function({ api, args, event, addThread, unregistThread, banUser, unbanUser, isThreadRegistered, fetchDatabase }) {
    const subCmd = args[0]; // Sub-command (ban, unban, regist, unregist, threadlist, userlist)
    const targetId = args[1]; // ID target (user atau thread)
    const threadId = event.threadID; // ID thread tempat command dikirim
    const adminId = event.senderID; // ID admin yang menjalankan command

    // Validasi sub-command
    if (!subCmd) {
      return api.sendMessage(
        "Sub-cmd tidak valid! Gunakan salah satu dari: ban, unban, regist, unregist, threadlist, userlist\nContoh: cmd ban 123456789",
        threadId
      );
    }

    switch (subCmd) {
      case "ban": {
        // Command: ban <userID>
        if (!targetId) {
          return api.sendMessage("Masukkan ID user yang ingin diban!", threadId);
        }
        const banResult = await banUser(targetId);
        if (banResult) {
          return api.sendMessage(`User ${targetId} berhasil diban!`, threadId);
        } else {
          return api.sendMessage(`Gagal memban user ${targetId}!`, threadId);
        }
      }

      case "unban": {
        // Command: unban <userID>
        if (!targetId) {
          return api.sendMessage("Masukkan ID user yang ingin di-unban!", threadId);
        }
        const unbanResult = await unbanUser(targetId);
        if (unbanResult) {
          return api.sendMessage(`User ${targetId} berhasil di-unban!`, threadId);
        } else {
          return api.sendMessage(`Gagal meng-unban user ${targetId}!`, threadId);
        }
      }

      case "regist": {
        // Command: regist
        const isRegistered = await isThreadRegistered(threadId);
        if (isRegistered) {
          return api.sendMessage("Thread ini sudah terdaftar.", threadId);
        }
        const registResult = await addThread(threadId, adminId);
        if (registResult) {
          return api.sendMessage(`Thread ${threadId} berhasil diregistrasi!`, threadId);
        } else {
          return api.sendMessage(`Gagal meregistrasi thread ${threadId}!`, threadId);
        }
      }

      case "unregist": {
        // Command: unregist
        const isRegistered = await isThreadRegistered(threadId);
        if (!isRegistered) {
          return api.sendMessage("Thread ini belum terdaftar.", threadId);
        }
        const unregistResult = await unregistThread(threadId);
        if (unregistResult) {
          return api.sendMessage(`Thread ${threadId} berhasil di-unregist!`, threadId);
        } else {
          return api.sendMessage(`Gagal meng-unregist thread ${threadId}!`, threadId);
        }
      }

      case "threadlist": {
        // Command: threadlist
        try {
          const db = await fetchDatabase('threads');
          if (!db || Object.keys(db).length === 0) {
            return api.sendMessage("Tidak ada thread yang terdaftar.", threadId);
          }

          let message = "📋 Daftar Thread Terdaftar:\n";
          for (const threadID in db) {
            if (db[threadID].registered) {
              message += `- Thread ID: ${threadID}\n`;
            }
          }
          return api.sendMessage(message, threadId);
        } catch (error) {
          console.error("Gagal mengambil thread list:", error);
          return api.sendMessage("Gagal mengambil daftar thread.", threadId);
        }
      }

      case "userlist": {
        // Command: userlist
        try {
          const db = await fetchDatabase('users');
          if (!db || Object.keys(db).length === 0) {
            return api.sendMessage("Tidak ada user yang terdaftar.", threadId);
          }

          let message = "📋 Daftar User Terdaftar:\n";
          for (const userID in db) {
            message += `- User ID: ${userID} | Nama: ${db[userID].nama || "Unknown"} | Yen: ${db[userID].yen} | Level: ${db[userID].level}\n`;
          }
          return api.sendMessage(message, threadId);
        } catch (error) {
          console.error("Gagal mengambil user list:", error);
          return api.sendMessage("Gagal mengambil daftar user.", threadId);
        }
      }

      default: {
        // Jika sub-cmd tidak valid
        return api.sendMessage(
          "Sub-cmd tidak valid! Gunakan salah satu dari: ban, unban, regist, unregist, threadlist, userlist\nContoh: cmd ban 123456789",
          threadId
        );
      }
    }
  }
};
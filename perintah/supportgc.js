module.exports = {
  hady: {
    nama: "supportgc",
    aliases: ['Hinagc', 'support', 'botgc'],
    version: "1.0",
    author: "kazith",
    countDown: 10,
    role: 0,
    shortDescription: { en: "grup dukungan" },
    longDescription: { en: "grup dukungan" },
    category: "system",
    guide: { en: ".supportgc" },
    supportGroupId: "9043935818995185"
  },
  Ayanokoji: async function ({ api, args, message, event }) {
    try {
      const threadID = event.threadID;
      const userID = event.senderID;

      // Check if the user is already in the support group
      const threadInfo = await api.getThreadInfo(this.hady.supportGroupId);
      const participantIDs = threadInfo.participantIDs;

      if (participantIDs.includes(userID)) {
        return api.sendMessage(
          "𝖠𝗇𝖽𝖺 𝗌𝗎𝖽𝖺𝗁 𝖻𝖾𝗋𝖺𝖽𝖺 𝖽𝗂 𝖽𝖺𝗅𝖺𝗆 𝗀𝗋𝗎𝗉 𝖽𝗎𝗄𝗎𝗇𝗀𝖺𝗇",
          threadID
        );
      }

      // Add user to the support group
      await api.addUserToGroup(userID, this.hady.supportGroupId);
      return api.sendMessage(
        "✅ 𝖡𝖾𝗋𝗁𝖺𝗌𝗂𝗅 𝗆𝖾𝗇𝖺𝗆𝖻𝖺𝗁𝗄𝖺𝗇 𝖺𝗇𝖽𝖺",
        threadID
      );
    } catch (error) {
      console.error("❎ 𝖦𝖺𝗀𝖺𝗅 𝗆𝖾𝗇𝖺𝗆𝖻𝖺𝗁𝗄𝖺𝗇 𝗉𝖾𝗇𝗀𝗀𝗎𝗇𝖺 𝗄𝖾𝗀𝗋𝗎𝗉:", error);
      return api.sendMessage(
        "❎ 𝖲𝖺𝗒𝖺 𝗍𝗂𝖽𝖺𝗄 𝖽𝖺𝗉𝖺𝗍 𝗆𝖾𝗇𝖺𝗆𝖻𝖺𝗁𝗄𝖺𝗇 𝖺𝗇𝖽𝖺",
        event.threadID
      );
    }
  }
};
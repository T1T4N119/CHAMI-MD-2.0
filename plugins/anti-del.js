const config = require("../settings");
const { getContentType } = require("@whiskeysockets/baileys");

module.exports = async function (bot) {
  bot.ev.on("messages.update", async (updates) => {
    for (const update of updates) {
      if (
        update.update.message === null &&
        config.ANTI_DELETE &&
        update.key &&
        update.key.remoteJid &&
        update.key.id &&
        !update.key.fromMe
      ) {
        try {
          const msg = await bot.store.loadMessage(update.key.remoteJid, update.key.id);
          if (!msg || !msg.message) return;

          const type = getContentType(msg.message);
          await bot.sendMessage(update.key.remoteJid, {
            text: `🚫 *Anti Delete*\n\n@${update.key.participant.split("@")[0]} deleted a message:\n\n🗂️ *Type:* ${type}`,
            mentions: [update.key.participant],
          }, { quoted: msg });
        } catch (err) {
          console.error("❌ Anti Delete Error:", err);
        }
      }
    }
  });
};

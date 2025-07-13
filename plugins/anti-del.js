const { cmd } = require("../lib/command");
const config = require("../settings");

module.exports = async function (bot) {
  bot.ev.on('messages.update', async (updates) => {
    for (const update of updates) {
      if (update.update.message === null && config.ANTI_DELETE) {
        try {
          const msg = await bot.store.loadMessage(update.key.remoteJid, update.key.id);
          if (!msg || !msg.message) return;

          await bot.sendMessage(update.key.remoteJid, {
            text: `🚫 *Anti Delete*\n\nMessage deleted by: @${update.key.participant.split("@")[0]}`,
            mentions: [update.key.participant],
          }, { quoted: msg });
        } catch (e) {
          console.log("❌ Anti Delete Error:", e);
        }
      }
    }
  });
};

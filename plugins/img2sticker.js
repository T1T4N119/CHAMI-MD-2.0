const { cmd, commands } = require("../lib/command");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { downloadMediaMessage } = require("../lib/msg.js");

cmd(
  {
    pattern: "sticker",
    alias: ["s", "stick"],
    desc: "Convert an image to a sticker",
    category: "utility",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      quoted,
      reply,
    }
  ) => {
    try {
      if (!quoted || !(quoted.imageMessage || quoted.videoMessage)) {
        return reply("🖼️ Please reply to an image or video to convert it to a sticker.");
      }

      const media = await downloadMediaMessage(quoted, "stickerInput");
      if (!media) return reply("❌ Failed to download media. Try again!");

      const sticker = new Sticker(media, {
        pack: "𝗖_𝗛_𝗔_𝗠_𝗜",
        author: "𝗖𝗛𝗔𝗠𝗢𝗗",
        type: StickerTypes.FULL,
        quality: 50,
      });

      const buffer = await sticker.toBuffer();
      await robin.sendMessage(from, { sticker: buffer }, { quoted: mek });
    } catch (e) {
      console.error(e);
      reply(`Error: ${e.message || e}`);
    }
  }
);

const { cmd } = require("../command");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { downloadMediaMessage } = require("../lib/msg.js");

cmd(
  {
    pattern: "sticker",
    alias: ["s", "stick"],
    desc: "Convert an image or short video to a sticker",
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
      args,
      reply,
    }
  ) => {
    try {
      if (!quoted || !["imageMessage", "videoMessage"].includes(quoted?.mtype)) {
        return reply("Please reply to an image or short video to convert it to a sticker.");
      }

      reply("Creating sticker...");

      const media = await downloadMediaMessage(quoted, "stickerInput");
      if (!media) return reply("Failed to download the media. Try again!");

      const sticker = new Sticker(media, {
        pack: "ᴄʜᴀᴍɪ-ᴍᴅ",
        author: "ᴄʜᴀᴍɪ-ᴍᴅ",
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

const { cmd } = require("../lib/command");
const { downloadMediaMessage } = require("../lib/msg.js");

cmd({
  pattern: "toimg",
  alias: ["img", "photo"],
  desc: "Convert sticker to image",
  category: "utility",
  filename: __filename,
}, async (robin, mek, m, { quoted, from, reply }) => {
  try {
    if (!quoted || !quoted.stickerMessage) {
      return reply("🧩 Reply to a sticker to convert to an image.");
    }

    const media = await downloadMediaMessage(quoted, "toimg");
    if (!media) return reply("❌ Couldn't download the sticker.");

    await robin.sendMessage(from, {
      image: media,
      caption: "🖼️ Here is your image!\n\n_Made by CHAMI_"
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});

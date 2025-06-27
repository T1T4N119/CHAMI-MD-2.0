const { cmd } = require('../lib/command');
const { downloadMediaMessage } = require('../lib/msg');

cmd({
  pattern: 'toimg',
  alias: ['sticker2img', 's2i'],
  desc: 'Convert sticker to image',
  category: 'convert',
  react: "🖼️",
  filename: __filename
}, async (conn, m, msg, { quoted, reply }) => {
  try {
    if (!quoted) return reply("📌 *Please reply to a sticker!*");

    const mime = quoted.mimetype || '';
    if (!mime.includes("webp")) return reply("❗ This command only works with *stickers*!");

    // Show loading react
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    // Download sticker
    const buffer = await downloadMediaMessage(quoted);

    // Send as image
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: "✅ *Sticker converted to image!*"
    }, { quoted: m });

    // Send success react
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error("❌ .toimg Error:", err);
    reply("⚠️ Error converting sticker to image. Try again.");
  }
});

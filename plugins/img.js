const { cmd } = require('../lib/command');
const fetch = require('node-fetch');

cmd({
  pattern: "img",
  alias: ["wp"],
  react: "🖼️",
  desc: "Search and download wallpapers",
  category: "download",
  use: ".wallpaper <query>|<page>\n.eg: .wallpaper car|1",
  filename: __filename
}, async (conn, m, msg, { q, reply }) => {
  try {
    if (!q.includes("|")) return reply("🔎 Please use format: `.wallpaper <text>|<page>`\n\nExample: `.wallpaper car|1`");

    const [text, page] = q.split("|").map(v => v.trim());
    if (!text || !page) return reply("⚠️ Invalid format. Try `.wallpaper car|1`");

    const apiUrl = `https://www.dark-yasiya-api.site/download/wallpaper?text=${encodeURIComponent(text)}&page=${page}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.result || data.result.length === 0) return reply("❌ No wallpapers found.");

    for (let wp of data.result.slice(0, 5)) {
      await conn.sendMessage(m.chat, {
        image: { url: wp.image },
        caption: `📥 *Downloaded wallpaper*\n\n🔤 *Search:* ${text}\n📄 *Page:* ${page}`
      }, { quoted: m });
    }

  } catch (e) {
    console.error(e);
    reply("❌ Error occurred while downloading wallpaper.");
  }
});

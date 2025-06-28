const { cmd } = require('../lib/command');
const fetch = require('node-fetch');

cmd({
  pattern: 'hentai2',
  desc: 'Send random hentai video',
  category: 'nsfw',
  react: '🔞',
  filename: __filename,
  nsfw: true, // NSFW check support (if your framework supports it)
}, async (conn, m, msg, { reply, isGroup, from }) => {
  try {
    // Optional NSFW group check if you use global.db.data.chats
    if (isGroup && !(global.db?.data?.chats?.[from]?.nsfw)) {
      return reply("🚫 NSFW content is disabled in this group.\nType: *.enable nsfw*");
    }

    await conn.sendMessage(from, { react: { text: "🔍", key: m.key } });

    const res = await fetch("https://www.dark-yasiya-api.site/download/henati");
    const data = await res.json();

    if (!data || !data.url) {
      return reply("❌ Couldn't fetch hentai content.");
    }

    await conn.sendMessage(from, {
      video: { url: data.url },
      caption: "🔞 *Random Hentai Video*"
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error("Hentai plugin error:", e);
    reply("❌ Error occurred while fetching hentai.");
  }
});

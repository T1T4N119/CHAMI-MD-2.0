const axios = require('axios');
const { cmd } = require('../lib/command');

cmd({
  pattern: "cinesubz",
  alias: ["csz", "cinelink"],
  desc: "Download movie from CineSubz URL",
  category: "downloader",
  use: '.cinesubz <cine-subz url>',
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { q, reply, from }) => {
  if (!q) return reply("🔗 *Please provide a CineSubz download URL!*");

  try {
    const res = await axios.get('https://api.infinityapi.org/cine-direct-dl', {
      headers: {
        'Authorization': 'Bearer Infinity-manoj-x-mizta' // << Your API Key here
      },
      params: {
        url: q
      }
    });

    const data = res.data;
    if (!data || !data.result || !data.result.url) {
      return reply("❌ No valid movie link found.");
    }

    const caption = `🎬 *CineSubz Movie Info*
━━━━━━━━━━━━━━
📌 *Title:* ${data.result.title || 'Unknown'}
📺 *Quality:* ${data.result.quality || 'N/A'}
💾 *Size:* ${data.result.size || 'N/A'}
📥 *Download:* ${data.result.url}

🔰 Powered by *CHAMI-MD*`;

    await conn.sendMessage(from, {
      image: { url: data.result.thumbnail || 'https://i.imgur.com/U4iN1PE.jpg' },
      caption
    }, { quoted: mek });

  } catch (err) {
    console.error('CineSubz Error:', err.response?.data || err.message);
    reply("❌ Error occurred while fetching CineSubz movie info.");
  }
});


const axios = require('axios');
const { cmd } = require('../lib/command');

cmd({
  pattern: "cinesubz",
  alias: ["csz", "moviedl"],
  desc: "Search & download movie from CineSubz by name",
  category: "downloader",
  use: '.cinesubz <movie name>',
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { q, reply, from }) => {
  if (!q) return reply("🔎 *Please provide a movie name to search!*");

  try {
    // Search the movie on CineSubz
    const searchRes = await axios.get('https://api.infinityapi.org/cine-search', {
      headers: {
        'Authorization': 'Bearer Infinity-manoj-x-mizta' // your API key
      },
      params: {
        query: q
      }
    });

    const results = searchRes.data?.result;
    if (!results || results.length === 0) return reply("❌ No movie found with that name.");

    // Pick first result
    const movie = results[0];

    // Now get download link
    const dlRes = await axios.get('https://api.infinityapi.org/cine-direct-dl', {
      headers: {
        'Authorization': 'Bearer Infinity-manoj-x-mizta'
      },
      params: {
        url: movie.url
      }
    });

    const data = dlRes.data?.result;
    if (!data?.url) return reply("❌ Couldn't fetch download link.");

    const caption = `🎬 *Movie Info:*
📌 Title: ${data.title}
🎞️ Quality: ${data.quality}
📥 Size: ${data.size}

🔗 *Download:* ${data.url}

> 🔰 Powered by CHAMI-MD`;

    await conn.sendMessage(from, {
      image: { url: data.thumbnail || 'https://i.imgur.com/U4iN1PE.jpg' },
      caption
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply("❌ Error occurred while searching or downloading the movie.");
  }
});

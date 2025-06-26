const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
  pattern: 'ytinfo ?(.*)',
  desc: 'Get YouTube video info using InfinityAPI',
  category: 'downloader',
  filename: __filename
}, async (conn, m, mek, { q, reply }) => {
  try {
    if (!q || !q.includes('http')) {
      return reply(`🔎 කරුණාකර valid YouTube link එකක් යවන්න.\n\n*උදා: .ytinfo https://youtu.be/dQw4w9WgXcQ*`);
    }

    const res = await axios.get('https://api.infinityapi.org/youtubeInfo', {
      headers: {
        'Authorization': 'Bearer Infinity-manoj-x-mizta'
      },
      params: {
        url: q
      }
    });

    const data = res.data;

    if (!data || !data.title) {
      return reply('⚠️ විස්තර ලබාගත නොහැකි විය!');
    }

    const caption = `*🎬 Title:* ${data.title}
*👤 Channel:* ${data.channel}
*⏱ Duration:* ${data.duration}
*📅 Published:* ${data.uploadDate}
*👁 Views:* ${data.views}
*🔗 URL:* ${q}`;

    await conn.sendMessage(m.from, {
      image: { url: data.thumbnail },
      caption
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply('🚫 දෝෂයක් ඇතිවුණා!\n\n```' + error.message + '```');
  }
});

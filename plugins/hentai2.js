const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
  pattern: 'hentai2 ?(.*)',
  desc: 'Download Hentai video from InfinityAPI',
  category: 'nsfw',
  filename: __filename
}, async (conn, m, mek, { q, reply }) => {
  try {
    if (!q || !q.startsWith('http')) {
      return reply(`🧠 *උදාහරණය:*\n.hentai2 https://www.xanimeporn.com/konomi-ja-nai-kedo-mukatsuku-ane-to-aishou-batsugun-ecchi-episode-2-sub-eng/`);
    }

    const res = await axios.get('https://api.infinityapi.org/hentaiinfo', {
      headers: {
        Authorization: 'Bearer Infinity-manoj-x-mizta'
      },
      params: {
        url: q
      }
    });

    const data = res.data;

    if (!data?.video?.url) {
      return reply('😥 Video එක හමුවුණේ නෑ.');
    }

    const caption = `*🎞️ Title:* ${data.title || 'N/A'}
*⏱️ Duration:* ${data.duration || 'Unknown'}
*📅 Released:* ${data.date || 'Unknown'}
*📥 Quality:* ${data.video.quality || 'HD'}`;

    await conn.sendMessage(m.from, {
      video: { url: data.video.url },
      mimetype: 'video/mp4',
      caption
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    return reply('🚫 Error fetching Hentai video.\n\n```' + err.message + '```');
  }
});

const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
  pattern: 'phdl',
  desc: 'Download Pornhub video using direct link',
  category: 'nsfw',
  react: '🔞',
  use: '.phdl <pornhub video URL>',
  filename: __filename
}, async (conn, m, msg, { from, reply, text }) => {
  if (!text) return reply('❗ Please provide a Pornhub video URL.\n\nUsage: .phdl <url>');

  try {
    const api = `https://phdl-ayo.vercel.app/api/phdl?url=${encodeURIComponent(text)}`;
    const res = await axios.get(api);

    if (!res.data || !res.data.result || res.data.result.length === 0) {
      return reply('❌ No download link found.');
    }

    const { title, thumb, result } = res.data;

    let caption = `🔞 *Pornhub Downloader*\n\n🎬 *Title:* ${title}\n\n📥 *Download Links:*\n`;
    result.forEach((item, index) => {
      caption += `\n${index + 1}. ${item.quality} - ${item.link}`;
    });

    await conn.sendMessage(from, {
      image: { url: thumb },
      caption
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    reply('❌ Error fetching download link. Maybe the video is private or the API failed.');
  }
});

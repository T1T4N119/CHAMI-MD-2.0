const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
  pattern: 'pornhub',
  desc: 'Download Pornhub video using link or search keyword',
  category: 'nsfw',
  react: '🔞',
  use: '.pornhub <url or keyword>',
  filename: __filename
}, async (conn, m, msg, { from, reply, text }) => {
  if (!text) return reply('❗ Please provide a Pornhub video URL or search keyword.\n\nUsage: .pornhub <url or keyword>');

  try {
    let url = text.trim();

    // If it's not a valid URL, treat it as a search keyword
    if (!/^https?:\/\//i.test(url)) {
      reply(`🔎 Searching Pornhub for: *${url}* ...`);

      const searchApi = `https://lustapi.vercel.app/pornhub/search?query=${encodeURIComponent(url)}`;
      const searchRes = await axios.get(searchApi);
      const videos = searchRes.data?.results;

      if (!videos || videos.length === 0) {
        return reply('❌ No results found for your query.');
      }

      url = videos[0].videoUrl; // Get first result's video URL
    }

    // Call downloader API
    const api = `https://phdl-ayo.vercel.app/api/phdl?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);

    if (!res.data || !res.data.result || res.data.result.length === 0) {
      return reply('❌ No download link found.');
    }

    const { title, thumb, result } = res.data;

    let caption = `🔞 *Pornhub Downloader*\n\n🎬 *Title:* ${title}\n\n📥 *Download Links:*\n`;
    result.forEach((item, index) => {
      caption += `\n${index + 1}. ${item.quality || 'Unknown'} - ${item.link}`;
    });

    await conn.sendMessage(from, {
      image: { url: thumb || 'https://i.ibb.co/tqv2M6h/default-ph-thumb.jpg' },
      caption
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    reply('❌ Error occurred. The video may be private or the API failed.');
  }
});

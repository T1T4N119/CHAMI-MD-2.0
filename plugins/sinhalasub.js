const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
  pattern: 'sinsub ?(.*)',
  category: 'movie',
  desc: 'Download Sinhala Subtitle episodes',
  use: '.sinsub <sinhalasub episode url>',
  react: '🎬'
}, async (message, match) => {
  try {
    const url = match || message.quoted?.text;
    if (!url || !url.includes('sinhalasub.lk')) {
      return await message.reply('📌 Please provide a valid SinhalaSub episode URL.\n\nExample:\n.sinsub https://sinhalasub.lk/episodes/game-of-thrones-1x1/');
    }

    const api = `https://www.dark-yasiya-api.site/movie/sinhalasub/episode?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);

    const data = res.data;

    if (!data || !data.data) {
      return await message.reply('🚫 Episode not found or API error.');
    }

    const { title, video_url, subtitle_url } = data.data;

    let caption = `🎬 *${title || 'Episode'}*\n\n`;
    caption += `📺 Video: ${video_url ? video_url : 'Not found'}\n`;
    caption += `📝 Subtitle: ${subtitle_url ? subtitle_url : 'Not found'}`;

    await message.reply(caption);

  } catch (err) {
    console.error(err);
    await message.reply('❌ Error occurred while fetching episode details.');
  }
});

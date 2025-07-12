const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
  pattern: 'zoom',
  desc: 'Zoom video search and download',
  category: 'search',
  use: '<query>',
  filename: __filename,
  react: '🔍'
}, async (message, match) => {
  try {
    if (!match) {
      return await message.reply('🔍 *Please enter a search query!*\n\n_Example: .zoom kabir singh_');
    }

    const apiUrl = `https://api.akuari.my.id/search/zoom?q=${encodeURIComponent(match)}`;
    const res = await axios.get(apiUrl);

    if (!res.data || !res.data.hasil || res.data.hasil.length === 0) {
      return await message.reply('❌ No results found!');
    }

    const results = res.data.hasil;
    let caption = `🔎 *Zoom Search Results for:* \`${match}\`\n\n`;

    results.slice(0, 5).forEach((video, i) => {
      caption += `📼 *${i + 1}. ${video.title}*\n`;
      caption += `📁 Size: ${video.size}\n`;
      caption += `📥 [Download Link](${video.link})\n\n`;
    });

    await message.reply(caption);
  } catch (e) {
    console.error('[Zoom Plugin Error]', e);
    await message.reply('❌ Error occurred while fetching zoom results.');
  }
});

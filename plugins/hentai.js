const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
  pattern: 'hentai',
  alias: ['nsfwh'],
  desc: 'Send random Hentai image',
  category: 'nsfw',
  react: '🔞',
  use: '.hentai',
  filename: __filename
}, async (conn, m, msg, { from, reply }) => {
  try {
    // Hentai API
    const apiKey = 'https://api.infinityapi.org/hentaiinfo?url=https://www.xanimeporn.com/konomi-ja-nai-kedo-mukatsuku-ane-to-aishou-batsugun-ecchi-episode-2-sub-eng/&api=Infinity-manoj-x-mizta'; // මෙතැනට ඔබේ API Key එක දාන්න
    const response = await axios.get(`https://hmtai.herokuapp.com/api/hmtai/hentai`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.data || !response.data.url) {
      return reply('⚠️ Failed to get image.');
    }

    const imageUrl = response.data.url;

    await conn.sendMessage(from, {
      image: { url: imageUrl },
      caption: `🔞 *Hentai Image*\n\n> Powered by CHAMI-MD`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    reply('❌ Error occurred while fetching hentai image.');
  }
});

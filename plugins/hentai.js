const axios = require('axios');
const { cmd } = require('../lib/command');

cmd({
  pattern: 'hentai',
  desc: 'Send NSFW Hentai Image',
  category: 'nsfw',
  react: '🔞',
  filename: __filename
}, async (conn, m, msg, { from, reply }) => {
  try {
    const res = await axios.get('https://api.waifu.pics/nsfw/waifu');
    const url = res.data.url;
    
    await conn.sendMessage(from, {
      image: { url },
      caption: `🔞 *NSFW Hentai*\n> Powered by CHAMI-MD`
    }, { quoted: m });
  } catch (err) {
    console.log("⛔ API Error:", err.response?.data || err.message);
    reply('❌ Error occurred while fetching hentai image.');
  }
});

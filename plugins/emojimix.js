const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
  pattern: "emojimix",
  alias: ["emix"],
  desc: "Mix two emojis using EmojiMix",
  category: "fun",
  filename: __filename,
}, async (conn, mek, m, { q, reply, from }) => {
  if (!q || !q.includes('+')) {
    return reply('🧪 *Use like:* `.emojimix 🥲+🤣`');
  }

  const [emoji1, emoji2] = q.split('+').map(e => e.trim());

  if (!emoji1 || !emoji2) {
    return reply('⚠️ Please provide **two emojis** separated by `+`.\n\n*Example:* `.emojimix 😍+😂`');
  }

  try {
    const encoded1 = encodeURIComponent(emoji1);
    const encoded2 = encodeURIComponent(emoji2);

    const res = await axios.get(`https://emojimix-api.vercel.app/api/v1/${encoded1}/${encoded2}`);
    
    if (!res.data?.images?.length) {
      return reply('❌ Emoji mix not found. Try with different emojis.');
    }

    await conn.sendMessage(from, {
      image: { url: res.data.images[0] },
      caption: `✨ *Emoji Mix:* ${emoji1} + ${emoji2}`,
    }, { quoted: mek });

  } catch (e) {
    console.error('EmojiMix error:', e);
    reply('❌ Failed to fetch emoji mix.');
  }
});

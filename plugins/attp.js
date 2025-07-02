const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
  pattern: 'attp',
  desc: 'Make RGB animated sticker from text',
  category: 'fun',
  use: '.attp <text>',
  react: '🌈'
}, async (m, match, { client }) => {
  const text = match[1]?.trim();

  if (!text) {
    return await client.sendMessage(m.chat, { text: '❗ Text ekak danna!\nEg: .attp CHAMI' }, { quoted: m });
  }

  try {
    const response = await axios.get('https://api.infinityapi.org/rgb-animation', {
      headers: {
        'Authorization': 'Bearer Infinity-manoj-x-mizta'
      },
      params: {
        text, // user typed text (ex: CHAMI)
        font: 'go3v2'
      },
      responseType: 'arraybuffer'
    });

    const buffer = Buffer.from(response.data);
    await client.sendMessage(m.chat, {
      sticker: buffer,
      mimetype: 'image/webp'
    }, { quoted: m });

  } catch (error) {
    console.error('❌ ATTP error:', error);
    await client.sendMessage(m.chat, { text: '❌ Sticker hadanna bari una. Try later.' }, { quoted: m });
  }
});

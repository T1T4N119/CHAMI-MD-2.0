const { cmd } = require('../lib/command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { downloadMediaMessage } = require('@whiskeysockets/baileys'); // Use your bot’s import if different

cmd({
  pattern: 'sticker',
  alias: ['s', 'stic'],
  desc: 'Convert image or short video to sticker',
  category: 'converter',
  react: '✨',
  use: '.sticker (reply to media)',
  filename: __filename
}, async (conn, m, msg, { from, reply, quoted }) => {
  try {
    if (!quoted) return reply('⚠️ Please reply to an image or video.');

    const mime = quoted.mimetype || '';
    if (!/image|video/.test(mime)) return reply('⚠️ Only image or video files can be converted.');

    const mediaBuffer = await downloadMediaMessage(quoted, 'buffer', {}, {});

    const sticker = new Sticker(mediaBuffer, {
      pack: 'CHAMI-MD',
      author: 'Chamod Yashmika',
      type: /video/.test(mime) ? StickerTypes.FULL : StickerTypes.CROPPED,
      quality: 80
    });

    const stickerBuffer = await sticker.toBuffer();

    await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: m });

  } catch (err) {
    console.error('Sticker error:', err);
    reply('❌ Failed to create sticker. Make sure it\'s an image or short video (under 10s).');
  }
});

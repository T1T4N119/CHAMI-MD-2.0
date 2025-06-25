const { cmd } = require('../lib/command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { downloadMediaMessage } = require('@whiskeysockets/baileys'); // Or your bot's media download helper

cmd({
  pattern: 'sticker',
  alias: ['stic', 's'],
  desc: 'Convert image or video to sticker',
  category: 'converter',
  react: '✨',
  use: '.sticker (reply to image/video)',
  filename: __filename
}, async (conn, m, msg, { from, reply, quoted }) => {
  try {
    const mime = (quoted?.mimetype || '');

    if (!quoted || !/image|video/.test(mime)) {
      return reply('📌 Please reply to an image or a short video to convert into a sticker.');
    }

    const mediaBuffer = await downloadMediaMessage(quoted, 'buffer', {}, {});

    const sticker = new Sticker(mediaBuffer, {
      pack: 'CHAMI-MD',
      author: 'Chamod Yashmika',
      type: StickerTypes.FULL, // FULL | CIRCLE | CROPPED
      quality: 80
    });

    const stickerBuffer = await sticker.toBuffer();

    await conn.sendMessage(from, {
      sticker: stickerBuffer
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    reply('❌ Failed to create sticker. Maybe file is too long or unsupported format.');
  }
});

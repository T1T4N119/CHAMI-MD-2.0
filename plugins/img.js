const { cmd } = require('../lib/command');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'img',
  desc: 'Download image sent by user',
  category: 'utility',
  use: '.img (reply to image)',
  filename: __filename
}, async (conn, m, msg, { quoted }) => {
  try {
    if (!quoted || !quoted.image) {
      return m.reply('Please reply to an image with the command.\n\nPowered by CHAMI-MD');
    }

    const buffer = await conn.downloadMediaMessage(quoted);

    const timestamp = Date.now();
    const fileName = `image_${timestamp}.jpg`;
    const filePath = path.join(__dirname, '..', 'downloads', fileName);

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    await m.reply(`Image downloaded successfully!\nSaved as: ${fileName}\n\nPowered by CHAMI-MD`);
  } catch (err) {
    console.error(err);
    m.reply('Failed to download image.');
  }
});

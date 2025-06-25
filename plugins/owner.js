const { cmd } = require('../lib/command');

cmd({
  pattern: 'owner',
  desc: 'Show bot owner info',
  category: 'info',
  react: '👑',
  use: '.owner',
  filename: __filename
}, async (conn, m, msg, { from, reply }) => {
  const ownerNumber = '94766315540'; // international format without +
  const ownerName = 'Chamod Yashmika';

  const ownerJid = ownerNumber + '@s.whatsapp.net';

  await conn.sendMessage(from, {
    contacts: {
      displayName: ownerName,
      contacts: [{
        vcard: `
BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;waid=${ownerNumber};type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}
END:VCARD
` }]
    },
    caption: `👑 Bot Owner\n\nName: ${ownerName}\nNumber: +${ownerNumber}`
  }, { quoted: m });
});

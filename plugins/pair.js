const qrcode = require('qrcode-terminal');
const { cmd } = require('../command');
const { useMultiFileAuthState, makeWASocket } = require('@whiskeysockets/baileys');

function generateSessionCode() {
  // 8-character random uppercase alphanumeric string like "NP57952H"
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

cmd({
  pattern: 'pair',
  desc: 'Generate QR code and session pairing code',
  owner: true,
  filename: __filename,
}, async (robin, mek, m, { reply }) => {
  try {
    const sessionCode = generateSessionCode();
    const sessionPath = `./lib/session-${sessionCode}`;

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const conn = makeWASocket({
      auth: state,
      printQRInTerminal: false, // අපි manual print කරන්නෙ
    });

    conn.ev.on('connection.update', (update) => {
      const { qr, connection } = update;

      if (qr) {
        qrcode.generate(qr, { small: true }); // Terminal එකේ QR code print
        reply(`QR code generated! Scan it with WhatsApp.\n\nYour session code is: *${sessionCode}*`);
      }

      if (connection === 'open') {
        reply('Bot connected successfully with session code: ' + sessionCode);
      }
    });

    conn.ev.on('creds.update', saveCreds);

    global.pairConn = conn;

  } catch (error) {
    reply('Error during pairing: ' + error.message);
  }
});

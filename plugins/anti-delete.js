const fs = require('fs');
const path = './settings.json'; // settings file path

// Settings load/save functions
function loadSettings() {
  try {
    return JSON.parse(fs.readFileSync(path));
  } catch {
    return { antidelete: false };
  }
}

function saveSettings(settings) {
  fs.writeFileSync(path, JSON.stringify(settings, null, 2));
}

module.exports = {
  name: 'antidelete',

  pattern: 'antidelete',
  desc: 'Turn ON/OFF Anti-delete feature',
  category: 'owner',

  async handler(m, conn) {
    if (!m.isOwner) return m.reply('Only owner can use this command.');

    const args = m.text.trim().split(' ');
    if (args.length < 2) return m.reply('Usage: .antidelete on or .antidelete off');

    const settings = loadSettings();

    if (args[1].toLowerCase() === 'on') {
      settings.antidelete = true;
      saveSettings(settings);
      return m.reply('Anti-delete is now *ON* ✅');
    } else if (args[1].toLowerCase() === 'off') {
      settings.antidelete = false;
      saveSettings(settings);
      return m.reply('Anti-delete is now *OFF* ❌');
    } else {
      return m.reply('Usage: .antidelete on or .antidelete off');
    }
  },

  async onDelete(conn, updates) {
    const settings = loadSettings();
    if (!settings.antidelete) return; // If off, do nothing

    try {
      for (const { key, message, participant, timestamp } of updates) {
        if (key.fromMe) continue; // skip bot's own messages

        const jid = key.remoteJid;
        const deletedBy = participant || key.participant || key.remoteJid;
        const sender = key.participant || key.remoteJid;

        const date = new Date(timestamp * 1000);
        const timeStr = date.toLocaleString('en-US', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: true
        });

        let deletedMsg = '';
        if (message.conversation) deletedMsg = message.conversation;
        else if (message.extendedTextMessage) deletedMsg = message.extendedTextMessage.text;
        else if (message.imageMessage) deletedMsg = '[📷 Image]';
        else if (message.videoMessage) deletedMsg = '[🎥 Video]';
        else deletedMsg = '[📩 Message]';

        const mentionDeletedBy = `@${deletedBy.split('@')[0]}`;
        const mentionSender = `@${sender.split('@')[0]}`;

        const text = `*🚫 This Message was deleted !!*\n\n` +
          `🕒 *Time:* _${timeStr}_\n` +
          `*🚮 Deleted by:* ${mentionDeletedBy}\n` +
          `*📩 Sent by:* ${mentionSender}\n\n` +
          `> 🔓 Message Text: \`\`\`${deletedMsg}\`\`\``;

        await conn.sendMessage(jid, { text, mentions: [deletedBy, sender] });
      }
    } catch (e) {
      console.error('AntiDelete plugin error:', e);
    }
  }
};

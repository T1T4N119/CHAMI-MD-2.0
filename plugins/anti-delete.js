const fs = require('fs');
const config = require('../settings');

function loadSettings() {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE));
  } catch {
    return { antidelete: false };
  }
}

function saveSettings(settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

module.exports = {
  name: 'antidelete',

  pattern: 'antidelete',
  desc: 'Turn ON/OFF Anti-delete feature',
  category: 'owner',

  async handler(m, conn) {
    if (!m.isOwner) return m.reply('Only owner can use this command.');

    const args = m.text.trim().split(' ');
    if (args.length < 2) return m.reply('Use: .antidelete on or .antidelete off');

    const settings = loadSettings();

    if (args[1].toLowerCase() === 'on') {
      settings.antidelete = true;
      saveSettings(settings);
      return m.reply('Anti-delete is now ON ✅');
    } else if (args[1].toLowerCase() === 'off') {
      settings.antidelete = false;
      saveSettings(settings);
      return m.reply('Anti-delete is now OFF ❌');
    } else {
      return m.reply('Use: .antidelete on or .antidelete off');
    }
  },

  async onDelete(conn, updates) {
    const settings = loadSettings();
    if (!settings.antidelete) return;

    try {
      for (const { key, message, participant, timestamp } of updates) {
        if (key.fromMe) continue;

        const jid = key.remoteJid;
        const deletedBy = participant || key.participant || jid;
        const sender = key.participant || jid;

        const date = new Date(timestamp * 1000);
        const timeStr = date.toLocaleString();

        let deletedMsg = '';
        if (message.conversation) deletedMsg = message.conversation;
        else if (message.extendedTextMessage) deletedMsg = message.extendedTextMessage.text;
        else if (message.imageMessage) deletedMsg = '[Image]';
        else if (message.videoMessage) deletedMsg = '[Video]';
        else deletedMsg = '[Message]';

        const text = `*🚫 This message was deleted!*\n\n` +
          `🕒 Time: _${timeStr}_\n` +
          `🚮 Deleted by: @${deletedBy.split('@')[0]}\n` +
          `📩 Sent by: @${sender.split('@')[0]}\n\n` +
          `> 🔓 Message Text: \`\`\`${deletedMsg}\`\`\``;

        await conn.sendMessage(jid, { text, mentions: [deletedBy, sender] });
      }
    } catch (e) {
      console.error('AntiDelete error:', e);
    }
  }
};

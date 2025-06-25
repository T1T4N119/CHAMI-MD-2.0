const { cmd } = require('../lib/command');

cmd({
  pattern: 'antidelete',
  desc: 'Enable or disable anti-delete feature (Inbox & Group)',
  category: 'main',
  filename: __filename
}, async (conn, mek, m, { from, sender, args, reply }) => {
  const setting = args[0]?.toLowerCase();
  if (!setting || !['on', 'off'].includes(setting)) {
    return reply('📌 Usage:\n.antidelete on\n.antidelete off');
  }

  global.db = global.db || {};
  global.db.antiDelete = global.db.antiDelete || {};
  global.db.antiDelete[from] = setting === 'on';

  reply(`✅ Anti-delete is now *${setting === 'on' ? 'enabled' : 'disabled'}* for this chat.`);
});

// --- MESSAGE DELETE LISTENER ---
conn.ev.on('messages.delete', async ({ messages }) => {
  for (const msg of messages) {
    try {
      if (!msg.message || msg.key.fromMe) return;

      const chatId = msg.key.remoteJid;
      if (!global.db?.antiDelete?.[chatId]) return;

      const sender = msg.key.participant || msg.participant || chatId;
      const deletedType = Object.keys(msg.message)[0];

      let caption = `🗑️ *Message Deleted!*\n\n`;
      caption += `👤 *Sender:* @${sender.split('@')[0]}\n`;
      caption += `📦 *Type:* ${deletedType}\n`;
      caption += `💬 *Recovered:*`;

      await conn.sendMessage(chatId, {
        text: caption,
        mentions: [sender]
      });

      await conn.sendMessage(chatId, msg.message, { quoted: msg });

    } catch (e) {
      console.error('❌ Anti-delete error:', e);
    }
  }
});

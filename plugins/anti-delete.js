const { smsg } = require('../lib/simple');
const config = require('../settings');
const fs = require('fs');

module.exports = {
  name: 'antidelete',
  description: 'Recover deleted messages (Group + Inbox)',
  type: 'event',

  async handle(m, conn, store) {
    try {
      if (
        m &&
        m.messageStubType === 1 &&
        m.key &&
        m.key.id &&
        !m.key.fromMe // avoid bot's own messages
      ) {
        const isAntideleteOn = config.ANTIDELETE === true;
        if (!isAntideleteOn) return;

        const jid = m.key.remoteJid;
        const deletedMessage = store.messages[jid]?.get(m.key.id);

        if (deletedMessage) {
          const sender = m.key.participant || m.key.remoteJid;
          const msg = `🚫 *Message Deleted!*\n\n🕒 *Time:* _${new Date().toLocaleString()}_\n*🗑️ Deleted By:* @${sender.split('@')[0]}\n*📩 Sent By:* @${deletedMessage.key.participant?.split('@')[0] || 'you'}`;

          await conn.sendMessage(jid, { text: msg, mentions: [sender] });
          await conn.relayMessage(jid, deletedMessage.message, { messageId: deletedMessage.key.id });
        }
      }
    } catch (e) {
      console.error("AntiDelete Error:", e);
    }
  }
};

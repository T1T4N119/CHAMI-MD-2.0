const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../settings');

// Read settings dynamically
let settings = require(configPath);

function getAnti() {
  return settings.ANTI_DELETE === true;
}

// This updates the settings.js file manually
function setAnti(status) {
  const filePath = path.resolve(__dirname, '../settings.js');
  let content = fs.readFileSync(filePath, 'utf-8');

  content = content.replace(
    /ANTI_DELETE\s*:\s*(true|false)/,
    `ANTI_DELETE: ${status}`
  );

  fs.writeFileSync(filePath, content);
  delete require.cache[require.resolve(configPath)];
  settings = require(configPath);
  return true;
}

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../settings');

const AntiDelete = async (conn, updates) => {
  for (const update of updates) {
    if (update.update.message !== null) continue;

    const store = global.Store?.messages?.get(update.key.remoteJid)?.get(update.key.id);
    if (!store || !store.message) return;

    const mek = store;
    const isGroup = isJidGroup(store.key.remoteJid);
    if (!getAnti()) return;

    const time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Colombo' });
    const sender = (mek.key.participant || mek.key.remoteJid).split('@')[0];
    const deleter = (update.key.participant || update.key.remoteJid).split('@')[0];
    const groupName = isGroup ? (await conn.groupMetadata(store.key.remoteJid)).subject : '';

    let msg = `🚫 *Message Deleted!*\n🕒 *Time:* _${time}_\n`;
    msg += isGroup ? `👤 *Deleted by:* @${deleter}\n📩 *Sent by:* @${sender}\n👥 *Group:* ${groupName}` : `👤 *User:* @${deleter}`;
    
    await conn.sendMessage(store.key.remoteJid, {
      text: msg,
      mentions: [sender + '@s.whatsapp.net', deleter + '@s.whatsapp.net']
    }, { quoted: mek });
  }
};

module.exports = {
  getAnti,
  setAnti,
  AntiDelete,
};

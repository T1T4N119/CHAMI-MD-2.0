const { cmd } = require('../lib/command');
const fs = require('fs');
const config = require('../settings');

cmd({
  pattern: 'update',
  desc: 'Change bot config like MODE',
  category: 'owner',
  filename: __filename,
  use: '.update MODE:public'
}, async (conn, m, msg, { q, reply, isOwner }) => {
  try {
    if (!isOwner) return reply('❌ Only owner can use this command!');
    const [key, value] = q.split(':');
    if (!key || !value) return reply("⚠️ Invalid format!\nUse: `.update MODE:public`");

    const upperKey = key.trim().toUpperCase();
    const lowerValue = value.trim().toLowerCase();

    if (upperKey !== "MODE") return reply("⚠️ Only `MODE` update is supported now.");

    if (!["public", "private", "inbox", "group"].includes(lowerValue)) {
      return reply("⚠️ Invalid MODE!\nAvailable: public, private, inbox, group");
    }

    config.MODE = lowerValue;

    // write to file
    const filePath = require.resolve('../settings.js');
    const settingsText = fs.readFileSync(filePath, 'utf8');
    const updatedText = settingsText.replace(/MODE\s*:\s*['"`](.*?)['"`]/, `MODE: "${lowerValue}"`);
    fs.writeFileSync(filePath, updatedText);

    reply(`✅ MODE updated to: *${lowerValue.toUpperCase()}*\n\nRestart bot to apply changes!`);

  } catch (e) {
    console.error(e);
    reply('❌ Failed to update.');
  }
});

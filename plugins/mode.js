const { cmd } = require('../lib/command');
const fs = require('fs');
const configPath = './settings.js';

cmd({
  pattern: "update",
  desc: "Update config settings via chat",
  category: "owner",
  use: ".update MODE:public",
  filename: __filename
}, async (conn, m, msg, { q, reply, isOwner }) => {
  if (!isOwner) return reply("❌ Only the owner can update settings!");
  if (!q || !q.includes(':')) return reply("⚠️ Invalid format!\nUse: `.update MODE:public`");

  const [keyRaw, valueRaw] = q.split(':');
  const key = keyRaw.trim().toUpperCase();
  const value = valueRaw.trim();

  try {
    let settings = fs.readFileSync(configPath, 'utf-8');

    const regex = new RegExp(`${key}\\s*=\\s*["'].*?["']`);
    if (!regex.test(settings)) return reply(`⚠️ Setting key \`${key}\` not found in settings.js`);

    const updatedLine = `${key} = "${value}"`;
    settings = settings.replace(regex, updatedLine);
    fs.writeFileSync(configPath, settings);

    reply(`✅ Successfully updated \`${key}\` to \`${value}\``);
  } catch (e) {
    console.error(e);
    reply("❌ Failed to update settings.");
  }
});

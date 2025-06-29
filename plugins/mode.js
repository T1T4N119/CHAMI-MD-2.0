const { cmd } = require('../lib/command');
const fs = require('fs');
const configPath = './settings';

cmd({
  pattern: "update",
  desc: "Update config values (like MODE, AUTO_READ_STATUS)",
  category: "owner",
  use: ".update MODE:public",
  filename: __filename
}, async (conn, m, msg, { q, reply, isOwner }) => {
  if (!isOwner) return reply("❌ Only owner can use this command!");

  if (!q || !q.includes(':')) return reply("⚠️ Invalid format!\nUse: `.update MODE:public`");

  const [keyRaw, ...rest] = q.split(':');
  const key = keyRaw.trim().toUpperCase();
  const value = rest.join(':').trim();

  try {
    if (!fs.existsSync(configPath)) return reply("❌ settings.js file not found.");

    let content = fs.readFileSync(configPath, 'utf-8');
    const regex = new RegExp(`(${key}\\s*=\\s*["'])([^"']*)(["'])`);
    const match = content.match(regex);

    if (!match) return reply(`❌ Setting "${key}" not found in settings.js`);

    const newLine = `${match[1]}${value}${match[3]}`;
    content = content.replace(regex, newLine);

    fs.writeFileSync(configPath, content);
    return reply(`✅ Updated \`${key}\` to \`${value}\` successfully!\n\n📌 Restart bot to apply.`);
  } catch (err) {
    console.error(err);
    reply("❌ Failed to update. Check console logs.");
  }
});

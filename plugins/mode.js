const fs = require('fs');
const { cmd } = require('../lib/command');
const configPath = './settings.js';

cmd({
  pattern: 'update',
  desc: 'Update bot settings like MODE: public/private/inbox/group',
  category: 'owner',
  use: '.update MODE:public',
  filename: __filename
}, async (conn, m, msg, { q, reply, isOwner }) => {
  if (!isOwner) return reply("❌ Only Owner can use this command.");
  if (!q || !q.toLowerCase().startsWith("mode:")) {
    return reply("❌ Invalid usage. Try: `.update MODE:public`");
  }

  const mode = q.split(":")[1]?.trim()?.toLowerCase();
  const validModes = ["public", "private", "inbox", "group"];

  if (!validModes.includes(mode)) {
    return reply("❗ Invalid MODE. Use one of: public, private, inbox, group");
  }

  try {
    let file = fs.readFileSync(configPath, 'utf8');
    const updated = file.replace(/MODE:\s*['"].*?['"],/, `MODE: '${mode}',`);
    fs.writeFileSync(configPath, updated);

    reply(`✅ Successfully updated MODE to *${mode.toUpperCase()}*\n🔁 Restarting bot...`);

    // Restart bot
    if (process.env.pm_id !== undefined) {
      require('child_process').exec('pm2 restart all');
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error(err);
    reply("❌ Error updating MODE setting.");
  }
});

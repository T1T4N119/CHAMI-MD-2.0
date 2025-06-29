const { cmd } = require('../lib/command');
const { exec } = require('child_process');

cmd({
  pattern: "restart",
  desc: "Restart the bot",
  category: "owner",
  filename: __filename
}, async (m) => {
  if (!m.isOwner) return m.reply("❌ Only the owner can restart the bot.");

  await m.reply("♻️ Restarting CHAMI-MD bot...");

  exec('pm2 restart CHAMI', (err, stdout, stderr) => {
    if (err) {
      console.error('Restart error:', stderr);
      return;
    }
    console.log('Bot restarted:\n', stdout);
  });
});

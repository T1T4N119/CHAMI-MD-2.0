const { cmd } = require('../lib/command');
const { exec } = require('child_process');

cmd({
  pattern: 'restart',
  desc: 'Restart the bot',
  category: 'owner',
  filename: __filename,
  use: '.restart',
  react: '♻️'
}, async (conn, m, msg) => {
  const { isOwner, reply } = msg;

  if (!isOwner) return reply('🚫 Only owner can use this command!');

  await reply('♻️ Restarting bot...');

  // Wait a bit before restarting
  setTimeout(() => {
    exec('pm2 restart all', (err, stdout, stderr) => {
      if (err) {
        reply(`❌ Error: ${err.message}`);
        return;
      }
    });
  }, 1000);
});

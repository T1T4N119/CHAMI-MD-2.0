const { cmd } = require('../lib/command');
const { exec } = require('child_process');

cmd({
  pattern: 'restart',
  desc: 'Restart the bot',
  category: 'owner',
  filename: __filename,
  use: '.restart'
}, async (conn, m, msg, { reply, isOwner }) => {
  if (!isOwner) return reply('❌ Only owner can use this command!');

  await reply('♻️ Restarting bot...');

  exec('pm2 restart all', (err, stdout, stderr) => {
    if (err) {
      console.error('Restart error:', err);
      return reply('❌ Failed to restart bot.');
    }
    console.log('Restart output:', stdout || stderr);
  });
});

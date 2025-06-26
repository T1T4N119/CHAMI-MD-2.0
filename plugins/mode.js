const { cmd } = require('../lib/command');
const fs = require('fs');
const config = require('../settings');

cmd({
    pattern: 'update',
    desc: 'Change bot mode',
    category: 'owner',
    react: '🔁',
    filename: __filename
},
async (conn, m, msg, { q, reply, isOwner }) => {
    if (!isOwner) return reply("🚫 Only Owner can use this command.");

    const modeInput = q.toLowerCase().replace("mode:", "").trim();
    const modeMap = {
        'public': 'public',
        'private': 'private',
        'inbox': 'inbox',
        'group': 'groups', // <- HERE: 'group' maps to 'groups'
    };

    if (!modeMap[modeInput]) {
        return reply(`❌ Invalid mode.\n\nValid modes:\n• public\n• private\n• inbox\n• group`);
    }

    const newMode = modeMap[modeInput];

    // Update config.MODE
    config.MODE = newMode;

    // Update settings.js
    const settingsPath = require.resolve('../settings');
    let file = fs.readFileSync(settingsPath, 'utf8');
    const updatedFile = file.replace(/MODE:\s*['"`][^'"`]+['"`]/, `MODE: '${newMode}'`);
    fs.writeFileSync(settingsPath, updatedFile);

    reply(`✅ Bot Mode Updated To: *${newMode.toUpperCase()}*`);
});

const { cmd } = require('../lib/command');
const fs = require('fs');
const path = require('path');
const settingsPath = path.join(__dirname, '../settings');

cmd({
    pattern: "antidelete",
    desc: "Toggle anti-delete feature",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { reply, text, isCreator }) => {
    if (!isCreator) return reply("🛑 This command is only for the bot owner.");

    try {
        const config = fs.readFileSync(settingsPath, 'utf8');
        const match = config.match(/ANTI_DELETE\s*=\s*(true|false)/);
        const currentStatus = match ? match[1] === 'true' : false;

        if (!text || !['on', 'off', 'status'].includes(text.toLowerCase())) {
            return reply(`*AntiDelete Status:* ${currentStatus ? '✅ ON' : '❌ OFF'}\n\nUsage:\n• .antidelete on\n• .antidelete off`);
        }

        if (text.toLowerCase() === 'status') {
            return reply(`*AntiDelete Status:* ${currentStatus ? '✅ ON' : '❌ OFF'}`);
        }

        const newStatus = text.toLowerCase() === 'on';
        const updated = config.replace(/ANTI_DELETE\s*=\s*(true|false)/, `ANTI_DELETE = ${newStatus}`);
        fs.writeFileSync(settingsPath, updated);
        reply(`✅ Anti-delete has been turned ${newStatus ? 'ON' : 'OFF'} successfully.`);
    } catch (err) {
        console.error("AntiDelete Toggle Error:", err);
        reply("❌ Error updating AntiDelete status.");
    }
});

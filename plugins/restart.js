const config = require('../settings');
const { cmd, commands } = require('../command');
const { sleep } = require('../lib/functions');
const { exec } = require("child_process");

cmd({
    pattern: "restart",
    desc: "Restart the bot",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, {
    from, reply, isOwner
}) => {
    if (!isOwner) return reply("Only owner can use this command!");

    try {
        reply("♻️ Restarting bot...");
        await sleep(1500);
        exec("pm2 restart all", (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return reply(`❌ Error: ${error.message}`);
            }
            if (stderr) {
                console.warn(`stderr: ${stderr}`);
                return reply(`⚠️ stderr: ${stderr}`);
            }
            reply("✅ Bot restarted successfully via PM2!");
        });
    } catch (e) {
        console.log(e);
        reply(`❌ Exception: ${e}`);
    }
});

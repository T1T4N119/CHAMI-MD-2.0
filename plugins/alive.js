const os = require("os");
const moment = require("moment-timezone");
const { cmd } = require('../lib/command');

cmd({
    pattern: "alive",
    alias: "bot",
    react: "✨",
    desc: "Check if chami bot is online.",
    category: "main",
    filename: __filename
}, async (gojo, mek, m, { from, reply }) => {
    try {
        const formatBytes = (bytes) => {
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 Byte';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
        };

        const used = formatBytes(process.memoryUsage().heapUsed);
        const totalRam = formatBytes(os.totalmem());
        const uptime = moment.duration(process.uptime(), "seconds").humanize();
        const time = moment.tz("Asia/Colombo").format("🕐 HH:mm:ss A");

        const caption = `*👋 Hello Sin Nombre*

🪄 *I am Alive Now 💗*

╭─❒ BOT INFO
│🤖 Bot Name : *CHAMI-MD*
│👑 Owner    : *Chamod Yashmika*
│📟 Version  : *0.0.1*
│💾 RAM      : *${used} / ${totalRam}*
│⏱️ Uptime   : *${uptime}*
│🖥 Platform : *${os.platform()}*
│⏰ Time     : *${time}*
╰────────────

> I’m an AUTOMATED WHATSAPP BOT with AI, search, data fetch & more.

⚠️ *RULES:*
1. 🚫 Spamming is not allowed.
2. 🚫 Don’t call the bot.
3. 🚫 Don’t spam the owner.

Type *.menu* to open user menu 💗

⚡ Powered By: *CHAMI-MD*`;

        await gojo.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ubalasiya/Chamihelper/refs/heads/main/chami-md-main.jpg" },
            caption: caption,
        }, { quoted: mek });

        await gojo.sendMessage(from, {
            audio: { url: "https://raw.githubusercontent.com/Ubalasiya/Chamihelper/main/PAIN.mp3" },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error in .alive command:\n" + e.message);
    }
});

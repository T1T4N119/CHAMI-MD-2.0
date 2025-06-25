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
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes === 0) return '0 Byte';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
        };

        const used = formatBytes(process.memoryUsage().heapUsed);
        const totalRam = formatBytes(os.totalmem());
        const uptime = moment.duration(process.uptime(), "seconds").humanize();
        const time = moment.tz("Asia/Colombo").format("🕐 HH:mm:ss A");

        const caption = `*👋𝗛𝗶⚡Chamod Yashmika*

*🪄 I am Alive Now 💗*

╭─❒ BOT INFO
│🧚‍♀️ Bot Name     : *CHAMI-MD*
│🧚‍♀️ Owner        : *Chamod Yashmika*
│🧚‍♀️ Version      : *0.0.1*
│🧚‍♀️ RAM Usage    : *${used} / ${totalRam}*
│🧚‍♀️ Uptime       : *${uptime}*
│🧚‍♀️ Platform     : *${os.platform()}*
│🧚‍♀️ Time         : *${time}*
╰────────────

> *I’m an AUTOMATED WHATSAPP BOT with search, data fetch, AI, and more — right from WhatsApp!* 🪀

*⚠️ RULES FIRST:*
😼 1. Spamming is Prohibited⚡  
😼 2. Don’t Call the Bot⚡  
😼 3. Don’t Spam the Owner⚡  
😼 4. Spam = Block⚡

*🪄 Type '.menu' to Unlock the Bot Menu 💗*

> *⚖️Powered By: © CHAMI-MD 💙*`;

        // Send image + message
        await gojo.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ubalasiya/Chamihelper/refs/heads/main/chami-md-main.jpg" },
            caption,
            footer: "🩵 CHAMI-MD 0.0.1",
            buttons: [
                { buttonId: ".menu", buttonText: { displayText: "📜 MENU" }, type: 1 },
                { buttonId: ".ping", buttonText: { displayText: "📶 PING" }, type: 1 }
            ],
            headerType: 4
        }, { quoted: mek });

        // Voice PTT message
        await gojo.sendMessage(from, {
            audio: { url: "https://raw.githubusercontent.com/Ubalasiya/Chamihelper/main/PAIN.mp3" },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error in .alive command:\n" + e);
    }
});


---

✅ මෙය අඩංගු වේ:

🔘 Buttons: .menu, .ping

📸 Thumbnail image

🎧 Voice PTT

🧠 RAM & uptime info

📆 Colombo time display

⚠️ Rules section + Branding



---

අවශ්‍ය නම්:

"battery status", "CPU info", "chat stats" වගේ වැඩත් දැම්මහම bot එක පට්ටයෙ.


එවැනි extra feature එකක් අවශ්‍ය නම් කියන්න, මම අලුත්ම වැඩක් හදා දෙන්නම් 😎💙.


const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    alias: ["status", "runtime", "uptime"],
    desc: "Check uptime and system status",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Generate system status message
        const status = `┏━❮ 🩵𝐋𝐀𝐊𝐈𝐘𝐀 𝐃𝐄𝐓𝐀𝐋𝐄𝐒🩵 ❯━
┃◈┃🤖 ʙᴏᴛ ɴᴀᴍᴇ :𝐋𝐀𝐊𝐈𝐘𝐀
┃◈┃🔖 ᴠᴇʀsɪᴏɴ : 2.0
┃◈┃📟 ᴘʟᴀᴛғᴏʀᴍ : Linux
┃◈┃👨‍💻ᴏᴡɴᴇʀ: 𝐌𝐑 𝐋𝐀𝐊𝐒𝐈𝐃𝐔
┃◈┃📆 ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())} 
┃◈┃📈ʀᴀᴍ ᴜsᴀɢᴇ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
┃◈┗━━━━━━━━━━━━━━𖣔𖣔
╰──────────────┈⊷
> 𝛲𝛩𝑊𝛯𝑅𝐷 𝐵𝑌 𝐿𝛥𝛫𝛪𝑌𝛥 𝛭𝐷`;

        // Send the status message with an image
        await conn.sendMessage(from, { 
            image: { url: `𝐈𝐀𝐌𝐆𝐄 𝐔𝐑𝐋` },  // Image URL
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: 'ᑕ𝐇𝐀𝐍𝐄𝐋 𝐉𝐈𝐃',
                    newsletterName: '𝛭𝑅 𝐿𝛥𝛫𝑆𝛪𝐷𝑈',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

//𝙲𝚁𝚁𝙰𝚃𝙴 𝙱𝚈 𝙼𝚁 𝙻𝙰𝙺𝚂𝙸𝙳𝚄
// 𝙻𝙰𝙺𝙸𝚈𝙰 𝙼𝙳 
//𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙱𝙾𝚃 𝙰𝙻𝙸𝚅𝙴 𝙿𝙻𝚄𝙶𝙸𝙽

const os = require("os");
const moment = require("moment-timezone");
const { cmd } = require('../lib/command');
 require('../lib/functions');

cmd({
    pattern: "alive2",
    alias: ["status", "runtime", "uptime"],
    desc: "Check uptime and system status",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Generate system status message
        const status = `┏━❮ 🩵𝐂𝐇𝐀𝐌𝐈-𝐌𝐃  𝐃𝐄𝐓𝐀𝐋𝐄𝐒🩵 ❯━
┃◈┃🤖 ʙᴏᴛ ɴᴀᴍᴇ : 𝐂𝐇𝐀𝐌𝐈-𝐌𝐃
┃◈┃🔖 ᴠᴇʀsɪᴏɴ : 1.0
┃◈┃📟 ᴘʟᴀᴛғᴏʀᴍ : Linux
┃◈┃👨‍💻ᴏᴡɴᴇʀ:  𝐂𝐇𝐀𝐌𝐎𝐃 𝐘𝐀𝐒𝐇𝐌𝐈𝐊𝐀
┃◈┃📆 ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())} 
┃◈┃📈ʀᴀᴍ ᴜsᴀɢᴇ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
┃◈┗━━━━━━━━━━━━━━𖣔𖣔
╰──────────────┈⊷
> 𝛲𝛩𝑊𝛯𝑅𝐷 𝐵𝑌 𝘊𝘏𝘈𝘔𝘐 𝛭𝐷`;

        // Send the status message with an image
        await conn.sendMessage(from, { 
            image: { url: `https://raw.githubusercontent.com/Ubalasiya/Chamihelper/refs/heads/main/chami-md-main.jpg` },  // Image URL
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '.forward 120363400286842022@g.us',
                    newsletterName: '𝐌𝐑 𝐂𝐇𝐀𝐌𝐈',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

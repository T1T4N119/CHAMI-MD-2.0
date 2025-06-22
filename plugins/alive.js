
const l = console.log
const config = require('../settings')
const { cmd, commands } = require('../lib/command')

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
        const status = `┏━❮ 🩵𝗖𝗛𝗔𝗠𝗜 𝗗𝗘𝗧𝗔𝗜𝗟𝗦🩵 ❯━
┃◈┃🤖 ʙᴏᴛ ɴᴀᴍᴇ :𝐂𝐇𝐀𝐌𝐈-𝐌𝐃
┃◈┃🔖 ᴠᴇʀsɪᴏɴ : 1.0
┃◈┃📟 ᴘʟᴀᴛғᴏʀᴍ : Linux
┃◈┃👨‍💻ᴏᴡɴᴇʀ: 𝐌𝐑 𝐂𝐇𝐀𝐌𝐎𝐃
┃◈┃📆 ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())} 
┃◈┃📈ʀᴀᴍ ᴜsᴀɢᴇ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
┃◈┗━━━━━━━━━━━━━━𖣔𖣔
╰──────────────┈⊷
> 𝙋𝙊𝙒𝙀𝙍𝘿 𝘽𝙔 𝘾𝙃𝘼𝙈𝙄-𝙈𝘿`;

        // Send the status message with an image
        await conn.sendMessage(from, { 
            image: { url: `https://raw.githubusercontent.com/Ubalasiya/Chamihelper/refs/heads/main/chami-md-main.jpg` },  // Image URL
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '',
                    newsletterName: '𝘾𝙃𝘼𝙈𝙄',
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

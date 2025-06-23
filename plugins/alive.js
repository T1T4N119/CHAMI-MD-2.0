const l = console.log
const config = require('../settings')
const { cmd, commands } = require('../lib/command')
cmd({
    pattern: "alive",
    alias: "bot",
    react: "✨",
    desc: "Check if chami bot is online.",
    category: "main",
    filename: __filename
}, async (gojo, mek, m, {
    from, reply
}) => {
    try {
        // Send image + caption
        await gojo.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ubalasiya/Chamihelper/refs/heads/main/chami-md-main.jpg" },
            caption: `┏━❮ 🩵𝗖𝗛𝗔𝗠𝗜 𝗗𝗘𝗧𝗔𝗜𝗟𝗦🩵 ❯━
┃◈┃🤖 ʙᴏᴛ ɴᴀᴍᴇ :𝐂𝐇𝐀𝐌𝐈-𝐌𝐃
┃◈┃🔖 ᴠᴇʀsɪᴏɴ : 1.0
┃◈┃📟 ᴘʟᴀᴛғᴏʀᴍ : Linux
┃◈┃👨‍💻ᴏᴡɴᴇʀ: 𝐌𝐑 𝐂𝐇𝐀𝐌𝐎𝐃
┃◈┃📈ʀᴀᴍ ᴜsᴀɢᴇ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
┃◈┗━━━━━━━━━━━━━━𖣔𖣔
╰──────────────┈⊷
> 𝙋𝙊𝙒𝙀𝙍𝘿 𝘽𝙔 𝘾𝙃𝘼𝙈𝙄-𝙈𝘿`
        }, { quoted: mek });

        // Send voice message (PTT style)
        await gojo.sendMessage(from, {
            audio: {
                url: "https://raw.githubusercontent.com/Ubalasiya/Chamihelper/main/PAIN.mp3"
            },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("Error in .alive command:\n" + e);
    }
});

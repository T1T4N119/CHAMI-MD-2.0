const { cmd, commands } = require('../lib/command');
const yts = require('yt-search');
const { fetchJson } = require('../lib/functions');
function extractYouTubeId(url) {
//==============please share======================
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
function convertYouTubeLink(q) {
//=========================create by mr lakiya=============
    const videoId = extractYouTubeId(q);
    if (videoId) {
        return ` https://www.youtube.com/watch?v=${videoId}`;
    }
    return q;
}

cmd({
    pattern: "song",
    alias: "play1",
    desc: "song dl.",
    react: "🎵",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        q = convertYouTubeLink(q);
        if (!q) return reply("*`Need title or Link`*");
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `
「🐉HASHI SONG DL🐉」

┏━❮ SON INFO ❯━
┃🤖 *ᴛɪᴛʟᴇ : ${data.title}*
┃📑 *ᴅᴜʀᴀᴛɪᴏɴ :* ${data.timestamp}* .
┃🔖 *ᴠɪᴇᴡꜱ : ${data.views}*
┃📟 *ᴜᴘʟᴏᴀᴅ : ${data.ago}*

┗━━━━━━━━━━━━━━𖣔𖣔
╭━━〔🔢 *REPLY NUMBER*〕━━┈⊷
┃•1 Download Audio 🎧
┃•2 Download Document  📁
┃•3 Download Voice 🎤
╰──────────────┈⊷
> MR LAKIYA
`;
let info = `
> MR LAKIYA
 `;   
const sentMsg = await conn.sendMessage(from, {
            image: { url: data.thumbnail},
            caption: desc,
  contextInfo: {
                mentionedJid: ['94760698006@s.whatsapp.net'],
                groupMentions: [],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363349375266377@newsletter',
                    newsletterName: "MR LAKIYA",
                    serverMessageId: 999
                }
            }
     }, {quoted: mek});
     
     const messageID = sentMsg.key.id;

        conn.ev.on('messages.upsert', async (messageUpdate) => {
            const mek = messageUpdate.messages[0];
            if (!mek.message) return;
            const messageType = mek.message.conversation || mek.message.extendedTextMessage?.text;
            const from = mek.key.remoteJid;
            const sender = mek.key.participant || mek.key.remoteJid;

            const isReplyToSentMsg = mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo.stanzaId === messageID;

            if (isReplyToSentMsg) {
                if (messageType === '1') {
                    await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

                    const down = await fetchJson(`https://lakiya-api-site.vercel.app/download/ytmp3new?url=${url}&type=mp3`);
                    const lakiDown = down.result.downloadUrl;

                    await conn.sendMessage(from, { react: { text: '📤', key: mek.key } });  
                    await conn.sendMessage(from, { 
                        audio: { url: lakiDown }, 
                        mimetype: "audio/mpeg",
                        contextInfo: {
                            externalAdReply: {
                                title: data.title,
                                body: data.videoId,
                                mediaType: 1,
                                sourceUrl: data.url,
                                thumbnailUrl: "https://i.ibb.co/21FZMnvR/Whats-App-Image-2025-03-04-at-11-35-19-AM.jpg",
                                renderLargerThumbnail: true,
                                showAdAttribution: true
                            }
                        }
                    }, { quoted: mek });
                    await conn.sendMessage(from, {});
                
                } else if (messageType === '2') {
                    await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

                    const down = await fetchJson(`https://lakiya-api-site.vercel.app/download/ytmp3new?url=${url}&type=mp3`);
                    const lakiDown = down.result.downloadUrl;

                    await conn.sendMessage(from, { react: { text: '📤', key: mek.key } });
                    await conn.sendMessage(from, {
                        document: { url: lakiDown },
                        mimetype: "audio/mp3",
                        fileName: `${data.title}.mp3`,
                        caption: info
                    }, { quoted: mek });
                    await conn.sendMessage(from, {});
                } else if (messageType === '3') {
                    await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

                    const down = await fetchJson(`https://lakiya-api-site.vercel.app/download/ytmp3new?url=${url}&type=mp3`);
                    const lakiDown = down.result.downloadUrl;

                    await conn.sendMessage(from, { react: { text: '📤', key: mek.key } });  
                    await conn.sendMessage(from, { 
                        audio: { url: lakiDown }, 
                        mimetype: "audio/mpeg",
                        ptt: "true",
                        contextInfo: {
                            externalAdReply: {
                                title: data.title,
                                body: data.videoId,
                                mediaType: 1,
                                sourceUrl: data.url,
                                thumbnailUrl: "https://files.catbox.moe/nggx7z.jfif",
                                renderLargerThumbnail: true,
                                showAdAttribution: true
                            }
                        }
                    }, { quoted: mek });
                    await conn.sendMessage(from, {}); 
                }
            }
        });
        
    } catch(e) {
        console.log(e);
        reply(`${e}`);
    }
});

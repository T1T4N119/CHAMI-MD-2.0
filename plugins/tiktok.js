const { cmd, commands } = require('../command');
const { fetchJson } = require('../functions');

cmd({
  pattern: "tiktok",
  alias: ['tt', 'ttdown'],
  react: "🎥",
  desc: "Download For Tiktok Videos",
  category: "download",
  filename: __filename
}, async (bot, message, args, { from, quoted, reply, q }) => {
  try {
    if (!q) {
      return await reply("Please provide a TikTok URL.");
    }
    
    if (!q.includes('tiktok.com')) {
      return await reply("This URL is invalid.");
    }

    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterName: "𝐌𝐑 𝐂𝐇𝐀𝐌𝐈",
        newsletterJid: "120363419906775942@newsletter"
      }
      
    };

    const apiResponse = await fetchJson(`https://api.agatz.xyz/api/tiktok?url=${q}`);

    const downloadMessage = `
*𝐓𝐈𝐊𝐓𝐎𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃*
    
*TITLE :* ${apiResponse.data.title}
*Author :* ${apiResponse.data.author.fullname}
*DURATION :* ${apiResponse.data.duration}
*VIEWS :* ${apiResponse.data.stats.views}

*1.1 ║❯❯ No-Watermark-01*
*1.2 ║❯❯ No-Watermark-SD*
*1.3 ║❯❯ No-Watermark-HD*
*1.4 ║❯❯ AUDIO DOWNLOAD*
 
> 𝛲𝛩𝑊𝛯𝑅𝐷 𝐵𝑌 𝐂𝐇𝐀𝐌𝐈-𝐌𝐃
`;

    const sentMessage = await bot.sendMessage(from, {
      image: { url: apiResponse.data.cover || '' },
      caption: downloadMessage,
      contextInfo
    }, { quoted: message });

    bot.ev.on("messages.upsert", async (msgUpdate) => {
      const receivedMessage = msgUpdate.messages[0];

      if (!receivedMessage.message || !receivedMessage.message.extendedTextMessage) {
        return;
      }

      const userResponse = receivedMessage.message.extendedTextMessage.text.trim();

      if (receivedMessage.message.extendedTextMessage.contextInfo &&
          receivedMessage.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
        
        switch (userResponse) {
          case '1.1':
            await bot.sendMessage(from, {
              video: { url: apiResponse.data.data[0].url },
              mimetype: "video/mp4",
              caption: `*𝛭𝑅 𝘊𝘏𝘈𝘔𝘐*`,
              contextInfo
            }, { quoted: receivedMessage });
            break;

          case '1.2':
            await bot.sendMessage(from, {
              video: { url: apiResponse.data.data[1].url },
              mimetype: "video/mp4",
              caption: `*𝛭𝑅 𝘊𝘏𝘈𝘔𝘐*`,
              contextInfo
            }, { quoted: receivedMessage });
            break;

          case '1.3':
            await bot.sendMessage(from, {
              video: { url: apiResponse.data.data[2].url },
              mimetype: "video/mp4",
              caption: `*𝘔𝘙 𝘊𝘏𝘈𝘔𝘐*`,
              contextInfo
            }, { quoted: receivedMessage });
            break;

          case '1.4':
            await bot.sendMessage(from, {
              audio: { url: apiResponse.data.music_info.url },
              mimetype: "audio/mpeg",
              contextInfo
            }, { quoted: receivedMessage });
            break;

          default:
            await bot.sendMessage(from, {
              text: " Invalid option. Please select a valid number."
            }, { quoted: receivedMessage });
            break;
        }
      }
    });

  } catch (error) {
    console.error(error);
    await reply(" Please try again later...*");
    await bot.sendMessage(botNumber + "94766315540@s.whatsapp.net", {
      text: ` Error Info:${error}`
    }, { quoted: message });
  }
});

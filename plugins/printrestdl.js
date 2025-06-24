//`printerst image dl`

const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pinterest",
    alias: ["pinterestdl", "pin", "pins", "pindownload"],
    desc: "Download media from Pinterest",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { args, quoted, from, reply }) => {
    try {
       
        if (args.length < 1) {
            return reply('❎ Please provide the Pinterest URL to download from.');
        }

       
        const pinterestUrl = args[0];

       
        const response = await axios.get(`https://allstars-apis.vercel.app/pinterest?search=${encodeURIComponent(pinterestUrl)}`);

        if (!response.data.status) {
            return reply('❎ Failed to fetch data from Pinterest.');
        }

        const media = response.data.BK9;
        
       
        const desc = `*®𝐌𝐑 𝐂𝐇𝐀𝐌𝐈 💚*

*💚DOWNLOAD PINTEREST💚*

*╭━━〔 𝐂𝐇𝐀𝐌𝐈 𝙈𝘿 〕━━┈⊷*
*┃◈╭─────────────·๏*
*┃◈┃•👨‍💻Owner - ${response.data.owner}*
*┃◈┃•👨‍💻 ᴏᴡɴᴇʀ: 𝐌𝐑 𝐂𝐇𝐀𝐌𝐈
*┃◈┃•🤖 ʙᴏᴛ ɴᴀᴍᴇ : 𝐂𝐇𝐀𝐌𝐈-𝐌𝐃**
*┃◈┃•📟 ᴘʟᴀᴛғᴏʀᴍ : Linux*
*┃◈└───────────┈⊷*
*╰──────────────┈⊷*
> ㋛︎ ᴘᴏᴡᴇʀᴅ ʙʏ  ᴍʀ  ᴄʜᴀᴍɪ ᶜᵒᵈᵉʳ`;

       
        if (media.length > 0) {
            const videoUrl = media.find(item => item.url.includes('.mp4'))?.url;
            const imageUrl = media.find(item => item.url.includes('.jpg'))?.url;

           
            if (videoUrl) {
                await conn.sendMessage(from, { video: { url: videoUrl }, caption: "> ⚜️𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 : ®𝐌𝐑 𝐂𝐇𝐀𝐌𝐈 💚" }, { quoted: mek });
            } 
            
            else if (imageUrl) {
                await conn.sendMessage(from, { image: { url: imageUrl }, caption: "> ⚜️𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 : ®𝐌𝐑 𝐂𝐇𝐀𝐌𝐈 💚" }, { quoted: mek });
            } else {
                reply('❎ No media found.');
            }
        } else {
            reply('❎ No media found.');
        }

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('❎ An error occurred while processing your request.');
    }
});

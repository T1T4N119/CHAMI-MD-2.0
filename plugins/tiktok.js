const { cmd } = require('../lib/command');
const fetch = require('node-fetch');

cmd({
  pattern: 'tiktok',
  alias: ['tt'],
  desc: 'Download TikTok Video',
  category: 'downloader',
  use: '.tiktok <link>',
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("❌ කරුණාකර TikTok ලින්ක් එකක් ලබා දෙන්න.");

    const res = await fetch(`https://api.dapuhy.xyz/downloader/tiktok?url=${encodeURIComponent(q)}&apikey=trial`);
    const data = await res.json();

    if (!data || !data.data || !data.data.nowatermark) {
      return reply("❌ Error: TikTok වීඩියෝව download කිරීම අසාර්ථකයි.");
    }

    let cap = `╭──❒ *TikTok Downloader*
│👤 Author: ${data.data.author.nickname || 'Unknown'}
│🎵 Music: ${data.data.music.title || 'N/A'}
│💬 Description: ${data.data.description || 'No caption'}
│🔗 Source: ${data.data.play || q}
╰───────────────⊷
> *Powered By CHAMI-MD 😈*`;

    await conn.sendMessage(from, {
      image: { url: data.data.cover || data.data.thumbnail },
      caption: `${cap}\n\n🎬 *Select a format to download:*

1️⃣ No Watermark (HD)
2️⃣ Watermark Version
3️⃣ Audio Only (MP3)

📩 _Reply with the option number (e.g., "1") to proceed._`
    }, { quoted: mek });

    // Listener for selection
    conn.ev.once('messages.upsert', async (msgUpdate) => {
      const msg = msgUpdate.messages[0];
      if (!msg.message || !msg.message.conversation) return;

      const option = msg.message.conversation.trim();

      switch (option) {
        case '1':
          await conn.sendMessage(from, {
            video: { url: data.data.nowatermark },
            mimetype: 'video/mp4',
            caption: '🎞️ *No Watermark Video* — Powered by CHAMI-MD'
          }, { quoted: msg });
          break;
        case '2':
          await conn.sendMessage(from, {
            video: { url: data.data.watermark },
            mimetype: 'video/mp4',
            caption: '🎞️ *Watermarked Video* — Powered by CHAMI-MD'
          }, { quoted: msg });
          break;
        case '3':
          await conn.sendMessage(from, {
            audio: { url: data.data.music.url },
            mimetype: 'audio/mpeg',
            ptt: false
          }, { quoted: msg });
          break;
        default:
          reply("❌ වැරදි අංකයකි. කරුණාකර 1, 2 හෝ 3 ලෙස උත්තර දෙන්න.");
      }
    });

  } catch (e) {
    console.log(e);
    reply("❌ Unexpected error occurred while downloading TikTok video.");
  }
});

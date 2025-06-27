const { cmd } = require('../lib/command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');
const fetch = require('node-fetch');

// 🎧 .song Command
cmd({
  pattern: "song",
  react: "🎧",
  desc: "Download YouTube song",
  category: "download",
  use: ".song <YouTube URL or Name>",
  filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix }) => {
  try {
    if (!q) return reply("🎵 Please provide a YouTube link or song name.");

    const yt = await ytsearch(q);
    if (!yt.results || yt.results.length === 0) return reply("❌ No results found!");

    const song = yt.results[0];
    const url = song.url;
    const thumb = song.thumbnail;

    const caption = `
🎧 *Title:* ${song.title}
⏱ *Duration:* ${song.timestamp}
👤 *Author:* ${song.author.name}
🔗 *URL:* ${url}

🔘 Select your download format below 👇`;

    const selectionList = {
      title: '🎵 Choose format type',
      sections: [
        {
          title: '👨‍🔧 Download as:',
          rows: [
            { title: '🎶 Play MP3', description: 'Audio format', id: `${prefix}mp3play ${url}` },
            { title: '📂 Document MP3', description: 'As document file', id: `${prefix}mp3doc ${url}` },
            { title: '💫 Voice Note', description: 'Voice Note (PTT)', id: `${prefix}mp3ptt ${url}` }
          ]
        }
      ]
    };

    await conn.sendMessage(from, {
      image: { url: thumb },
      caption,
      footer: 'CHAMI-MD BY CHAMOD YASHMIKA 👨‍🔧',
      buttons: [
        {
          buttonId: 'action',
          buttonText: { displayText: '📥 Select Format' },
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify(selectionList),
          }
        }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply("❌ Error occurred. Try again.");
  }
});

// 📂 .mp3doc (Document download)
cmd({
  pattern: "mp3doc",
  filename: __filename
}, async (conn, mek, m, { q, from, reply }) => {
  try {
    if (!q.startsWith('http')) return reply("❗ Invalid URL.");
    const res = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(q)}`);
    const data = await res.json();

    if (!data.result?.downloadUrl) return reply("❌ Failed to fetch audio.");

    await conn.sendMessage(from, {
      document: { url: data.result.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: 'CHAMI-MD.mp3'
    }, { quoted: mek });
  } catch (e) {
    console.error(e);
    reply("❌ Error in document download.");
  }
});

// 🎶 .mp3play (Normal audio)
cmd({
  pattern: "mp3play",
  filename: __filename
}, async (conn, mek, m, { q, from, reply }) => {
  try {
    if (!q.startsWith('http')) return reply("❗ Invalid URL.");
    const res = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(q)}`);
    const data = await res.json();

    if (!data.result?.downloadUrl) return reply("❌ Failed to fetch audio.");

    await conn.sendMessage(from, {
      audio: { url: data.result.downloadUrl },
      mimetype: 'audio/mpeg'
    }, { quoted: mek });
  } catch (e) {
    console.error(e);
    reply("❌ Error in playing audio.");
  }
});

// 💫 .mp3ptt (Voice Note)
cmd({
  pattern: "mp3ptt",
  filename: __filename
}, async (conn, mek, m, { q, from, reply }) => {
  try {
    if (!q.startsWith('http')) return reply("❗ Invalid URL.");
    const res = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(q)}`);
    const data = await res.json();

    if (!data.result?.downloadUrl) return reply("❌ Failed to fetch audio.");

    await conn.sendMessage(from, {
      audio: { url: data.result.downloadUrl },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: mek });
  } catch (e) {
    console.error(e);
    reply("❌ Error in voice note.");
  }
});

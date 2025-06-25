const { cmd } = require("../lib/command");
const fetch = require("node-fetch");

cmd({
  pattern: "song2",
  alias: ["ytmp3", "ytaudio"],
  desc: "Download YouTube MP3 by link",
  category: "media",
  filename: __filename,
}, async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("🔍 Please provide a YouTube link or name.");

  try {
    const api = `https://vihangayt.me/download/ytmp3?q=${encodeURIComponent(q)}`;
    const res = await fetch(api);
    const data = await res.json();

    if (!data.status || !data.data || !data.data.dl_link) {
      return reply("❌ Failed to fetch. Try another link or name.");
    }

    await conn.sendMessage(from, {
      audio: { url: data.data.dl_link },
      mimetype: "audio/mpeg",
      fileName: `${data.data.title}.mp3`,
      ptt: false,
    }, { quoted: mek });
  } catch (e) {
    console.log(e);
    reply("❌ Error while downloading song.");
  }
});

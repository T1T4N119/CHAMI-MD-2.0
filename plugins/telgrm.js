const axios = require("axios");
const cheerio = require("cheerio");
const { cmd } = require("../command");

cmd({
  pattern: "tgdl",
  alias: ["telegramdl", "tgdownload"],
  desc: "Telegram public video/file download කරන්න",
  category: "download",
  filename: __filename
}, async (robin, mek, m, { args, reply }) => {
  try {
    const url = args[0];

    if (!url || !url.includes("t.me")) {
      return reply("කරුණාකර valid Telegram post url එකක් යවන්න.\n\nඋදා: `.tgdl https://t.me/s/somechannel/12345`");
    }

    const match = url.match(/t\.me\/s?\/([\w\d_]+)\/(\d+)/);
    if (!match) return reply("URL එක හරියටම එවන්න (Public post URL).");

    const channel = match[1];
    const postId = match[2];
    const tgPostURL = `https://t.me/s/${channel}/${postId}`;

    const res = await axios.get(tgPostURL);
    const $ = cheerio.load(res.data);

    // Try to find a video source or image inside the post
    const videoLink = $("video source").attr("src");
    const imageLink = $("img").first().attr("src");

    if (videoLink) {
      const directUrl = `https://t.me${videoLink}`;
      const videoBuffer = (await axios.get(directUrl, { responseType: "arraybuffer" })).data;
      await robin.sendMessage(m.from, { video: videoBuffer, caption: "Telegram video download 🔻", mimetype: "video/mp4" }, { quoted: mek });
    } else if (imageLink) {
      const directImageUrl = `https://t.me${imageLink}`;
      const imgBuffer = (await axios.get(directImageUrl, { responseType: "arraybuffer" })).data;
      await robin.sendMessage(m.from, { image: imgBuffer, caption: "Telegram Image 📷" }, { quoted: mek });
    } else {
      return reply("මෙම post එකේ video හෝ image එකක් හමු නොවීය.");
    }
  } catch (err) {
    console.error(err);
    reply("⚠️ Telegram එකෙන් file එක ලබා ගැනීමේ දෝෂයකි.\nඔබ URL එකේ විශේෂයෙන් සත්‍ය බව තහවුරු කරන්න.");
  }
});

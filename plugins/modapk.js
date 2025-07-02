const { cmd } = require('../lib/command');
const axios = require('axios');
const cheerio = require('cheerio');

cmd({
  pattern: "modapk",
  alias: ["apkmod", "modapp"],
  desc: "Search and get Mod APK from moddroid.com",
  category: "download",
  filename: __filename,
}, async (conn, m, msg, { q, reply }) => {
  if (!q) return reply("🔍 Please provide an app name.\n\nExample: `.modapk Spotify`");

  try {
    reply("⏳ Searching moddroid.com...");

    const searchURL = `https://moddroid.com/?s=${encodeURIComponent(q)}`;
    const { data } = await axios.get(searchURL);
    const $ = cheerio.load(data);

    const firstResult = $(".posts.clearfix > li").first();

    if (!firstResult || firstResult.length === 0) return reply("❌ No mod apk found.");

    const title = firstResult.find("h2").text().trim();
    const link = firstResult.find("a").attr("href");
    const img = firstResult.find("img").attr("src");

    // Get download page
    const apkPage = await axios.get(link);
    const _$ = cheerio.load(apkPage.data);
    const dlBtn = _$(".download-btn a").first().attr("href") || "🔗 Visit link manually.";

    let caption = `*📱 App Name:* ${title}\n`;
    caption += `*🌐 Source:* moddroid.com\n`;
    caption += `*📥 Download:* ${dlBtn}\n`;

    await conn.sendMessage(msg.from, {
      image: { url: img },
      caption,
    }, { quoted: m });

  } catch (e) {
    console.log(e);
    reply("❌ Failed to fetch mod apk. Try again later.");
  }
});

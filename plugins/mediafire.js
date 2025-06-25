const { cmd } = require('../lib/command');
const { getBuffer } = require('../lib/functions');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

cmd({
  pattern: "mediafire",
  alias: ["mf", "mfdl"],
  desc: "Download files from Mediafire",
  category: "download",
  use: ".mediafire <mediafire_link>",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("🔗 කරුණාකර Mediafire ලින්ක් එකක් provide කරන්න.");
    if (!q.includes("mediafire.com")) return reply("❌ මෙය Mediafire ලින්ක් එකක් නොවෙයි.");

    const res = await fetch(q);
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $("div.dl-btn-label").text().trim() || "Unknown File";
    const size = $("a#downloadButton").text().match(/([^)]+)/)?.[1] || "Unknown";
    const url = $("a#downloadButton").attr("href");

    if (!url) return reply("❌ Download link එක ලබාගත නොහැක.");

    let msg = `╭─❒ *📥 MEDIAFIRE FILE DETAILS*
│
│🗂️ *File Name:* ${title}
│📦 *Size:* ${size}
│🔗 *Link:* ${q}
│📥 *Status:* Sending file...
│
╰─❒ *Powered by CHAMI-MD* ⚡`;

    await reply(msg);

    await conn.sendMessage(from, {
      document: { url },
      mimetype: "application/octet-stream",
      fileName: title,
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply("❌ දෝෂයක් සිදු විය. Download link එක check කරන්න.");
  }
});

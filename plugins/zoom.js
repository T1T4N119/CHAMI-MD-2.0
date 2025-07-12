const { cmd } = require("../lib/command");
const axios = require("axios");
const cheerio = require("cheerio");

cmd({
  pattern: "zoom",
  desc: "Search content on zoom.lk",
  category: "download",
  react: "🔍",
  filename: __filename
}, async (bot, message, utils, { from, args, reply }) => {
  try {
    if (!args[0]) return reply("⚠️ *Please provide a search term!*");

    const searchTerm = args.join(" ");
    const searchUrl = "https://zoom.lk/?s=" + encodeURIComponent(searchTerm);
    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);
    const results = [];

    $("div.td-pb-span8.td-main-content > div > div.td_module_16.td_module_wrap.td-animation-stack").each((index, element) => {
      const title = $(element).find("div.item-details > h3 > a").text();
      const link = $(element).find("div.item-details > h3 > a").attr("href");
      const time = $(element).find("time").text();
      const author = $(element).find("div.item-details span a").first().text() || "Unknown";
      const desc = $(element).find("div.td-excerpt").text().trim();
      const comments = $(element).find("span.td-module-comments a").text() || "0";
      const image = $(element).find("img").attr("src") || "";

      results.push({ title, link, image, author, desc, comments, time });
    });

    if (results.length === 0) return reply("📭 *No results found!*");

    let messageText = "*🔎 ZOOM SEARCH RESULTS 🔍*\n\n";
    results.slice(0, 5).forEach((result, i) => {
      messageText += `*${i + 1}. ${result.title}*\n🕒 ${result.time}\n👤 ${result.author}\n🔗 ${result.link}\n💬 ${result.desc}\n\n`;
    });

    messageText += "_Forwarded by CHAMI-MD_";
    await reply(messageText);
  } catch (err) {
    console.error(err);
    reply("❌ An error occurred while processing your request.");
  }
});

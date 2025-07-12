const axios = require('axios');
const cheerio = require('cheerio');

cmd({
  pattern: "zoom",
  desc: "Search content on zoom.lk",
  category: "download",
  react: "🔍",
  filename: __filename
}, async (bot, message, utils, { from, args, reply }) => {
  try {
    if (!args[0]) {
      return reply("⚠️ *Please provide a search term!*");
    }

    const searchTerm = args.join(" ");
    const searchUrl = "https://zoom.lk/?s=" + encodeURIComponent(searchTerm);
    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);
    const results = [];

    $("div.td-pb-span8.td-main-content > div > div.td_module_16.td_module_wrap.td-animation-stack").each((index, element) => {
      const time = $(element).find("div.item-details > div > span > time").text();
      const title = $(element).find("div.item-details > h3 > a").text();
      const author = $(element).find("div.item-details > div > span > a").text() || "Unknown";
      const desc = $(element).find("div.item-details > div.td-excerpt").text().trim();
      const comments = $(element).find("div.item-details > div > span.td-module-comments a").text() || "0";
      const image = $(element).find("div.td-module-thumb > img").attr("src") || "";
      const link = $(element).find("div.item-details > h3 > a").attr("href");

      results.push({
        title,
        link,
        image,
        author,
        desc,
        comments,
        time
      });
    });

    if (results.length === 0) {
      return reply("📭 *No results found!*");
    }

    let messageText = "*ZOOM SEARCH RESULTS*\n\n";
    results.forEach((result, index) => {
      const shortDesc = result.desc.length > 200 ? result.desc.substring(0, 197) + "..." : result.desc;
      messageText += `*${index + 1}. ${result.title}*${result.time ? `\n⏰ Posted: ${result.time}` : ''}\n`;
      messageText += `👤 Author: ${result.author}\n`;
      messageText += `💭 Description: ${shortDesc}\n`;
      messageText += `🔗 Link: ${result.link}\n\n`;
    });

    messageText += "> ᴘᴏᴡᴇʀᴅ ʙʏ ᴄʜᴀᴍɪ-ᴍᴅ🍷";

    await reply(messageText);

  } catch (error) {
    console.error(error);
    reply("❌ An error occurred while processing your request.");
  }
});

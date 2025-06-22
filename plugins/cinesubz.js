const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
  pattern: "cinesubz",
  desc: "Search on Cinesubz",
  category: "movie",
  react: "🔍",
  filename: __filename
}, async (bot, mek, m, { from, args, reply }) => {
  try {
    if (!args[0]) {
      return reply("⚠️ *Please provide a search term!*");
    }

    const searchTerm = args.join(" ");
    const response = await axios.get("https://cinesubz.co/?s=" + encodeURIComponent(searchTerm));
    const $ = cheerio.load(response.data);
    const results = [];

    $(".result-item").each((index, element) => {
      const title = $(element).find(".title a").text().trim();
      const link = $(element).find(".title a").attr("href");
      const image = $(element).find(".thumbnail img").attr("src");
      const type = $(element).find(".thumbnail span").first().text().trim();
      const rating = $(element).find(".meta .rating").first().text().trim();
      const year = $(element).find(".meta .year").text().trim();
      const description = $(element).find(".contenido p").text().trim();

      results.push({
        title,
        link,
        image,
        type,
        rating,
        year,
        description
      });
    });

    if (results.length === 0) {
      return reply("📭 *No results found!*");
    }

    let messageText = "╭─────────────────\n┃▸┃ 🎬 *CINESUBZ RESULTS*\n┃▸└─────────────────···\n\n";

    results.forEach((result, index) => {
      messageText += "*" + (index + 1) + ". " + result.title + "*\n";
      messageText += "📺 Type: " + result.type + "\n";
      if (result.rating) {
        messageText += "⭐ Rating: " + result.rating + "\n";
      }
      if (result.year) {
        messageText += "📅 Year: " + result.year + "\n";
      }
      messageText += "🔗 Link: " + result.link + "\n\n";
    });

    messageText += "\n\n*> ꜰᴏʀᴡᴀʀᴅ ʙʏ ᴄʜᴀᴍɪ ᴍᴅ";
    await reply(messageText);
  } catch (error) {
    console.error(error);
    reply("❌ An error occurred while processing your request.");
  }
});
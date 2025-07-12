const { cmd } = require("../lib/command");
const { File } = require("megajs");
const fs = require("fs");
const path = require("path");

cmd({
  pattern: "mega",
  desc: "Download files from MEGA.nz",
  category: "download",
  react: "📥",
  filename: __filename
}, async (bot, m, { args, reply }) => {
  const url = args[0];

  if (!url || !url.includes("mega.nz")) {
    return reply("❌ *Please provide a valid MEGA.nz file link!*");
  }

  try {
    const file = File.fromURL(url);
    await reply("📥 *Downloading from MEGA.nz... Please wait!*");

    file.loadAttributes((err, file) => {
      if (err) return reply("❌ Error loading MEGA file attributes.");

      const fileName = file.name || "mega_file";
      const filePath = path.join(__dirname, "..", "temp", fileName);

      file.download()
        .pipe(fs.createWriteStream(filePath))
        .on("finish", async () => {
          const data = fs.readFileSync(filePath);
          const sendOpt = fileName.endsWith(".pdf")
            ? { document: data, mimetype: 'application/pdf', fileName }
            : { document: data, mimetype: "application/octet-stream", fileName };

          await bot.sendMessage(m.chat, sendOpt, { quoted: m });
          fs.unlinkSync(filePath); // delete after send
        })
        .on("error", async () => {
          return reply("❌ Failed to download file.");
        });
    });
  } catch (err) {
    console.error(err);
    reply("❌ Error: Invalid MEGA file link or server issue.");
  }
});

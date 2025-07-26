const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { cmd } = require("../lib/command");

cmd({
  pattern: "download",
  desc: "Download any file from direct link",
  category: "downloader",
}, async (conn, m, match, { from, reply }) => {
  let url = match || m.quoted?.text;

  if (!url || !url.startsWith("http")) {
    return reply("📥 ɢɪᴠᴇ ᴍᴇ ʟɪɴᴋ !!!: `.download https://example.com/file.pdf`");
  }

  try {
    reply("📡 Dᴏᴡɴʟᴏᴀᴅɪɴɢ Yᴏᴜʀ Fɪʟᴇ...");

    const fileName = path.basename(new URL(url).pathname);
    const filePath = path.join(__dirname, "..", "downloads", fileName);

    // Make sure downloads folder exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", async () => {
      await conn.sendMessage(from, {
        document: fs.readFileSync(filePath),
        fileName,
        mimetype: response.headers["content-type"] || "application/octet-stream",
      }, { quoted: m });

      fs.unlinkSync(filePath); // Delete temp file after sending
    });

    writer.on("error", (err) => {
      console.error(err);
      reply("❌ File download failed.");
    });

  } catch (err) {
    console.error(err);
    reply("❌ Error: ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟ ❗.");
  }
});

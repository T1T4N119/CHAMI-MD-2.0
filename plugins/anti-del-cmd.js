const fs = require("fs");
const path = require("path");
const settingsPath = path.join(__dirname, "../settings.js");
const { cmd } = require("../lib/command");

cmd({
  pattern: "antidelete ?(.*)",
  desc: "Turn Anti-Delete on or off",
  category: "main",
  react: "🛡️",
  filename: __filename
}, async (bot, m, { args, isOwner, reply }) => {
  if (!isOwner) return reply("❌ *Only owner can use this command!*");
  const input = args[0]?.toLowerCase();
  if (!["on", "off"].includes(input)) return reply("🛡️ Use: *.antidelete on* or *.antidelete off*");

  try {
    let content = fs.readFileSync(settingsPath, "utf8");
    content = content.replace(/ANTI_DELETE\s*=\s*(true|false)/, `ANTI_DELETE = ${input === "on"}`);
    fs.writeFileSync(settingsPath, content);
    reply(`✅ Anti-Delete turned *${input.toUpperCase()}*`);
  } catch (err) {
    console.error(err);
    reply("❌ Error updating settings.");
  }
});

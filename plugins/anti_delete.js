const { cmd } = require('../lib/command');
const config = require('../settings');

// Enable/Disable Anti Delete
cmd({
  pattern: "update",
  desc: "Toggle Anti Delete",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { q, reply, isOwner }) => {
  if (!isOwner) return reply("❌ Only owner can use this.");

  if (q.toLowerCase() === "anti_delete:true") {
    config.ANTI_DELETE = "true";
    reply("✅ Anti Delete turned *ON*.");
  } else if (q.toLowerCase() === "anti_delete:false") {
    config.ANTI_DELETE = "false";
    reply("❌ Anti Delete turned *OFF*.");
  }
});

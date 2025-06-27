const { cmd } = require('../lib/command');

cmd({
  pattern: "getpp",
  react: "🖼️",
  desc: "Sends the profile picture of a user by phone number (owner only)",
  category: "owner",
  use: ".getpp <phone number>",
  filename: __filename
},
async (conn, mek, m, { from, args, reply, isOwner }) => {
  try {
    if (!isOwner) return reply("🛑 This command is only for the bot owner!");

    if (!args[0]) return reply("🔥 Please provide a phone number (e.g., .getpp 94712345678)");

    // Clean phone number and add WhatsApp domain
    let phone = args[0].replace(/[^0-9]/g, "");
    if (!phone.endsWith("@s.whatsapp.net")) phone += "@s.whatsapp.net";

    let ppUrl;
    try {
      ppUrl = await conn.profilePictureUrl(phone, 'image');
    } catch {
      return reply("🖼️ This user has no profile picture or it cannot be accessed!");
    }

    // Get contact name fallback
    let userName = phone.split("@")[0];
    try {
      const contact = await conn.getContact(phone);
      userName = contact.notify || contact.vname || userName;
    } catch {}

    // Send profile picture with caption
    await conn.sendMessage(from, {
      image: { url: ppUrl },
      caption: `📌 Profile picture of ${userName}`
    }, { quoted: mek });

    // React with check mark on command message
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (e) {
    reply("🛑 An error occurred while fetching the profile picture! Please try again later.");
    console.error(e);
  }
});

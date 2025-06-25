const { cmd } = require("../command");
const path = require("path");
const fs = require("fs");

// settings.js එකේ path එක
const settingsPath = path.join(__dirname, "../settings.js");

cmd(
  {
    pattern: "setmode ?(.*)",
    desc: "Bot work mode එක වෙනස් කරන්න (private/public/inbox)",
    category: "owner",
    filename: __filename,
    owner: true,
  },
  async (robin, mek, m, { from, args, reply, isOwner }) => {
    try {
      if (!isOwner) return reply("මෙම command එක භාවිතා කරන්න අවසර නැත.");

      const mode = args[0]?.toLowerCase();
      if (!mode || !["private", "public", "inbox"].includes(mode)) {
        return reply(
          "කරුණාකර valid mode එකක් යවන්න: private, public, inbox"
        );
      }

      // settings.js එක අකුරු විදිහට කියවමු
      let data = fs.readFileSync(settingsPath, "utf-8");

      // MODE variable එක replace කරන්න (regex එකෙන්)
      // උදා: exports.MODE = "private";
      const newData = data.replace(
        /exports\.MODE\s*=\s*["'`].*?["'`];?/,
        `exports.MODE = "${mode}";`
      );

      // settings.js එකට ලියමු
      fs.writeFileSync(settingsPath, newData, "utf-8");

      reply(`Bot work mode එක \`${mode}\` ලෙස සාර්ථකව වෙනස් කරන ලදි!`);

      console.log(`Bot mode changed to: ${mode}`);
    } catch (e) {
      console.error(e);
      reply("Mode update කිරීමේ දෝෂයක් සිදුවිණි.");
    }
  }
);

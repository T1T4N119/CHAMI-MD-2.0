const { cmd } = require('../lib/command');
const fs = require('fs');
const path = require('path');
const settingsPath = path.join(__dirname, '../settings.js');
let config = require('../settings');

// TRUE command
cmd({
  pattern: "update AUTO_READ_STATUS:true",
  desc: "Enable auto status seen",
  category: "owner",
  filename: __filename,
  react: "✅"
},
async (conn, m, msg, { reply, isOwner }) => {
  if (!isOwner) return reply("❌ Only owner can run this command.");
  let settings = fs.readFileSync(settingsPath, "utf-8");
  settings = settings.replace(/AUTO_READ_STATUS:\s*(true|false)/, "AUTO_READ_STATUS: true");
  fs.writeFileSync(settingsPath, settings);
  config.AUTO_READ_STATUS = true;
  reply("✅ AUTO_READ_STATUS set to *true* successfully.");
});

// FALSE command
cmd({
  pattern: "update AUTO_READ_STATUS:false",
  desc: "Disable auto status seen",
  category: "owner",
  filename: __filename,
  react: "❌"
},
async (conn, m, msg, { reply, isOwner }) => {
  if (!isOwner) return reply("❌ Only owner can run this command.");
  let settings = fs.readFileSync(settingsPath, "utf-8");
  settings = settings.replace(/AUTO_READ_STATUS:\s*(true|false)/, "AUTO_READ_STATUS: false");
  fs.writeFileSync(settingsPath, settings);
  config.AUTO_READ_STATUS = false;
  reply("❌ AUTO_READ_STATUS set to *false* successfully.");
});

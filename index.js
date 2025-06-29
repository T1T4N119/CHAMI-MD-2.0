const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, jidDecode, makeInMemoryStore, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const path = require('path');
const config = require('./config');
const { Boom } = require('@hapi/boom');

const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });

const connectToWA = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['CHAMI-MD', 'Chrome', '1.0.0'],
    auth: state,
  });

  store.bind(sock.ev);

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(chalk.red('Connection closed. Reconnecting...'), shouldReconnect);
      if (shouldReconnect) connectToWA();
    } else if (connection === 'open') {
      console.log(chalk.green('✅ CHAMI-MD Connected Successfully'));

      // 🔥 Connected message to OWNER
      await sock.sendMessage(config.OWNER_NUMBER + '@s.whatsapp.net', {
        text: '*📡 Successfully Connected to WhatsApp* ✓\n\n Welcome to 𝗖𝗛𝗔𝗠𝗜-𝗠𝗗. Your bot is now securely active. \n\n> ◦ *Official  Channel* - ```https://whatsapp.com/channel/0029VbAvLMM0Vyc9KfRBrS3i```\n> ◦ To join support group type: *.joinsup*\n*👨‍💻 CHAMI-MD WhatsApp Bot*\nCreated by • chamod yashmika',
        contextInfo: {
          externalAdReply: {
            title: "👨‍💻 CHAMI MD 👨‍💻\nSuccessfully Connected !",
            thumbnailUrl: "https://raw.githubusercontent.com/Ubalasiya/Chamihelper/refs/heads/main/chami-md-main.jpg",
            sourceUrl: "",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      });
    }
  });

  // ✅ Anti-delete
  sock.ev.on('messages.delete', async ({ messages }) => {
    const msg = messages[0];
    if (msg.key && msg.key.remoteJid && msg.message) {
      const jid = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      await sock.sendMessage(jid, {
        text: `🗑️ Message deleted by @${sender.split('@')[0]}\n\n${JSON.stringify(msg.message, null, 2)}`,
        mentions: [sender],
      });
    }
  });

  // ✅ Message handling
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = isGroup ? msg.key.participant : from;
    const isOwner = config.OWNER_NUMBER + '@s.whatsapp.net' === sender;
    const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

    const command = body.trim().split(' ')[0].toLowerCase();

    // ✅ MODE Checks
    if (!isOwner && config.MODE === 'private') return;
    if (!isOwner && isGroup && config.MODE === 'inbox') return;
    if (!isOwner && !isGroup && config.MODE === 'groups') return;

    // ✅ Owner React
    if (isOwner) {
      await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });
    }

    // ✅ Simple Commands
    switch (command) {
      case 'jid':
        await sock.sendMessage(from, { text: sender });
        break;

      default:
        if (isOwner && body.startsWith('$')) {
          let code = body.split('$')[1];
          try {
            let evaled = await eval(code);
            await sock.sendMessage(from, { text: util.format(evaled) });
          } catch (e) {
            await sock.sendMessage(from, { text: util.format(e) });
          }
        }
    }

    // ✅ Auto-read
    await sock.readMessages([msg.key]);
  });
};

app.get("/", (req, res) => {
  res.send("📟 Chami-Md Working successfully!");
});

app.listen(port, () => console.log(`Chami-Md Server listening on port http://localhost:${port}`));

setTimeout(() => {
  connectToWA();
}, 3000);

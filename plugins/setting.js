const { cmd } = require('../lib/command');

cmd({
  pattern: "settings",
  alias: ["setting"],
  desc: "Settings the bot",
  category: "owner",
  react: "⚙",
  filename: __filename
}, async (conn, mek, m, { from, isOwner, quoted, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");

  try {
    const desc = `⚙️ *CHAMI-MD SETTINGS MENU* ⚙️

🔢 Reply with the number to change the setting:

1.1 Public Mode      1.2 Private Mode
1.3 Group Only       1.4 Inbox Only

2.1 Auto Voice ON    2.2 Auto Voice OFF

3.1 Auto Read Status ON    3.2 OFF

4.1 Auto Sticker ON  4.2 OFF

5.1 Auto Reply ON    5.2 OFF

6.1 Online True      6.2 False

7.1 Read Msg ON      7.2 OFF

8.1 Auto React ON    8.2 OFF

9.1 Anti Link ON     9.2 OFF    9.3 + Remove

10.1 Status React ON     10.2 OFF
10.3 Status Reply ON     10.4 OFF

11.1 Auto AI ON      11.2 OFF

*Powered by CHAMI-MD 💚*`;

    const sent = await conn.sendMessage(from, {
      image: { url: "https://raw.githubusercontent.com/Ubalasiya/Chamihelper/refs/heads/main/chami-md-main.jpg" },
      caption: desc
    }, { quoted: mek });

    const handler = async (msgUpdate) => {
      const newMsg = msgUpdate.messages[0];
      if (!newMsg.message?.extendedTextMessage?.text) return;
      const text = newMsg.message.extendedTextMessage.text.trim();
      const contextId = newMsg.message.extendedTextMessage.contextInfo?.stanzaId;

      if (contextId !== sent.key.id) return;

      const updates = {
        '1.1': 'MODE:public',
        '1.2': 'MODE:private',
        '1.3': 'MODE:groups',
        '1.4': 'MODE:inbox',
        '2.1': 'AUTO_VOICE:true',
        '2.2': 'AUTO_VOICE:false',
        '3.1': 'AUTO_READ_STATUS:true',
        '3.2': 'AUTO_READ_STATUS:false',
        '4.1': 'AUTO_STICKER:true',
        '4.2': 'AUTO_STICKER:false',
        '5.1': 'AUTO_REPLY:true',
        '5.2': 'AUTO_REPLY:false',
        '6.1': 'ALLWAYS_OFFLINE:true',
        '6.2': 'ALLWAYS_OFFLINE:false',
        '7.1': 'READ_MESSAGE:true',
        '7.2': 'READ_MESSAGE:false',
        '8.1': 'AUTO_REACT:true',
        '8.2': 'AUTO_REACT:false',
        '9.1': 'ANTI_LINK:true',
        '9.2': 'ANTI_LINK:false',
        '9.3': 'ANTI_LINK_REMOVE:true',
        '10.1': 'AUTO_REACT_STATUS:true',
        '10.2': 'AUTO_REACT_STATUS:false',
        '10.3': 'AUTO_STATUS_REPLY:true',
        '10.4': 'AUTO_STATUS_REPLY:false',
        '11.1': 'AUTO_AI:true',
        '11.2': 'AUTO_AI:false'
      };

      if (updates[text]) {
        reply(`.update ${updates[text]}`);
      } else {
        reply("❌ Invalid option. Please select a valid number.");
      }

      conn.ev.off('messages.upsert', handler);
    };

    conn.ev.on('messages.upsert', handler);

  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    reply('An error occurred while processing your request.');
  }
});

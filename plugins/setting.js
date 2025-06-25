const { cmd } = require('../lib/command');

cmd({
  pattern: 'settings',
  desc: 'Show CHAMI-MD bot settings',
  category: 'owner',
  react: '⚙️',
  filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
  if (!isOwner) return reply('❌ You are not the owner!');
  
  try {
    const desc = `
*_⚙️ CHAMI-MD SETTINGS INFO ⚙️_*

*🔢 Reply below number*,
*🔮 WORK_TYPE 🔮*

1.1 || _PUBLIC ✔️_
1.2 || _PRIVATE ✔️_
1.3 || _ONLY GROUP ✔️_
1.4 || _INBOX ✔️_

*🔮 AUTO_STATUS_READ 🔮*

2.1 || _ON ✔️_
2.2 || _OFF ❌_

*🔮 AUTO_MSG_READ 🔮*

3.1 || _ON ✔️_
3.2 || _OFF ❌_

*🔮 AUTO_RECORDING 🔮*

4.1 || _ON ✔️_
4.2 || _OFF ❌_

*🔮 AUTO_TYPING 🔮*

5.1 || _ON ✔️_
5.2 || _OFF ❌_

*🔮 READ_ONLY_COMMANDS 🔮*

6.1 || _ON ✔️_
6.2 || _OFF ❌_

*🔮 AUTO_BLOCK 🔮*

7.1 || _ON ✔️_
7.2 || _OFF ❌_

*🔮 ANTI_CALL 🔮*

8.1 || _ON ✔️_
8.2 || _OFF ❌_

*🔮 AUTO_REACT 🔮*

9.1 || _ON ✔️_
9.2 || _OFF ❌_

*🔮 AI_CHAT 🔮*

10.1 || _ON ✔️_
10.2 || _OFF ❌_

*🔮 ANTI_DELETE 🔮*

11.1 || _ON ✔️_
11.2 || _OFF ❌_

*🔮 ANTI_LINK 🔮*

12.1 || _ON ✔️_
12.2 || _OFF ❌_

*🔮 ANTI_BOT 🔮*

13.1 || _ON ✔️_
13.2 || _OFF ❌_

*🔮 ANTI_BAD 🔮*

14.1 || _ON ✔️_
14.2 || _OFF ❌_

*🔮 XNXX_BLOCK 🔮*

15.1 || _ON ✔️_
15.2 || _OFF ❌_

*🔮 MOVIE_BLOCK 🔮*

16.1 || _ON ✔️_
16.2 || _OFF ❌_

*🔮 ALWAYS_ONLINE 🔮*

17.1 || _ON ✔️_
17.2 || _OFF ❌_

*🔮 AUTO_VOICE 🔮*

18.1 || _ON ✔️_
18.2 || _OFF ❌_

*• CHAMI-MD •*
    `;

    const sentMsg = await conn.sendMessage(from, { text: desc }, { quoted: mek });

    conn.ev.on('messages.upsert', async (msgUpdate) => {
      const msg = msgUpdate.messages[0];
      if (!msg.message || !msg.message.extendedTextMessage) return;
      if (msg.key.remoteJid !== from) return;
      if (msg.key.fromMe) return;

      const replyText = msg.message.extendedTextMessage.text.trim();

      if (msg.message.extendedTextMessage.contextInfo?.stanzaId === sentMsg.key.id) {
        switch (replyText) {
          case '1.1': 
            reply('.update MODE:public');
            break;
          case '1.2': 
            reply('.update MODE:private');
            break;
          case '1.3': 
            reply('.update MODE:group');
            break;
          case '1.4': 
            reply('.update MODE:inbox');
            break;
          case '2.1': 
            reply('.update AUTO_STATUS_READ:true');
            break;
          case '2.2': 
            reply('.update AUTO_STATUS_READ:false');
            break;
          case '3.1': 
            reply('.update AUTO_MSG_READ:true');
            break;
          case '3.2': 
            reply('.update AUTO_MSG_READ:false');
            break;
          case '4.1': 
            reply('.update AUTO_RECORDING:true');
            break;
          case '4.2': 
            reply('.update AUTO_RECORDING:false');
            break;
          case '5.1': 
            reply('.update AUTO_TYPING:true');
            break;
          case '5.2': 
            reply('.update AUTO_TYPING:false');
            break;
          case '6.1': 
            reply('.update READ_ONLY_COMMANDS:true');
            break;
          case '6.2': 
            reply('.update READ_ONLY_COMMANDS:false');
            break;
          case '7.1': 
            reply('.update AUTO_BLOCK:true');
            break;
          case '7.2': 
            reply('.update AUTO_BLOCK:false');
            break;
          case '8.1': 
            reply('.update ANTI_CALL:true');
            break;
          case '8.2': 
            reply('.update ANTI_CALL:false');
            break;
          case '9.1': 
            reply('.update AUTO_REACT:true');
            break;
          case '9.2': 
            reply('.update AUTO_REACT:false');
            break;
          case '10.1': 
            reply('.update AI_CHAT:true');
            break;
          case '10.2': 
            reply('.update AI_CHAT:false');
            break;
          case '11.1': 
            reply('.update ANTI_DELETE:true');
            break;
          case '11.2': 
            reply('.update ANTI_DELETE:false');
            break;
          case '12.1': 
            reply('.update ANTI_LINK:true');
            break;
          case '12.2': 
            reply('.update ANTI_LINK:false');
            break;
          case '13.1': 
            reply('.update ANTI_BOT:true');
            break;
          case '13.2': 
            reply('.update ANTI_BOT:false');
            break;
          case '14.1': 
            reply('.update ANTI_BAD:true');
            break;
          case '14.2': 
            reply('.update ANTI_BAD:false');
            break;
          case '15.1': 
            reply('.update XNXX_BLOCK:true');
            break;
          case '15.2': 
            reply('.update XNXX_BLOCK:false');
            break;
          case '16.1': 
            reply('.update MOVIE_BLOCK:true');
            break;
          case '16.2': 
            reply('.update MOVIE_BLOCK:false');
            break;
          case '17.1': 
            reply('.update ALWAYS_ONLINE:true');
            break;
          case '17.2': 
            reply('.update ALWAYS_ONLINE:false');
            break;
          case '18.1': 
            reply('.update AUTO_VOICE:true');
            break;
          case '18.2': 
            reply('.update AUTO_VOICE:false');
            break;
          default:
            reply('Invalid option. Please select a valid number from the list.');
        }
      }
    });

  } catch (e) {
    console.error(e);
    reply('Error occurred while showing settings.');
  }
});

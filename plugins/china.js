const { cmd, commands } = require('../command')
const { fetchJson } = require('../lib/functions');
var cants = "I cant find this Image."

cmd({
    pattern: "china",
    react: '〽️',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let res = await fetchJson(`https://api.agatz.xyz/api/china`)
let wm = `〽️ Random china image Search

//𝛲𝛩𝑊𝛯𝑅𝐷 𝐵𝑌 𝘊𝘏𝘈𝘔𝘐*`
await conn.sendMessage(from, { image: { url: res.data.url }, caption: wm}, { quoted: mek })
} catch (e) {
reply(cants)
console.log(e)
}
});

const { cmd } = require('../lib/command');
const { isJidGroup } = require('@whiskeysockets/baileys');

cmd({
  pattern: 'join',
  desc: 'Join a group via link',
  category: 'group',
  filename: __filename,
  owner: true // Usually join group is owner only
}, async (conn, mek, m, { args, reply }) => {
  if (!args[0]) return reply('Please provide a group invite link.');
  try {
    await conn.groupAcceptInvite(args[0]);
    reply('✅ Joined the group!');
  } catch (e) {
    reply('Failed to join group. Make sure invite link is valid.');
  }
});

cmd({
  pattern: 'leave',
  desc: 'Leave the current group',
  category: 'group',
  filename: __filename,
  group: true,
  botAdmin: true
}, async (conn, mek, m, { from }) => {
  await conn.groupLeave(from);
});

cmd({
  pattern: 'mute',
  desc: 'Mute group (only admins can send messages)',
  category: 'group',
  filename: __filename,
  group: true,
  botAdmin: true,
  admin: true
}, async (conn, mek, m, { from, reply }) => {
  try {
    await conn.groupSettingUpdate(from, 'announcement');
    reply('Group muted: only admins can send messages.');
  } catch (e) {
    reply('Failed to mute group.');
  }
});

cmd({
  pattern: 'unmute',
  desc: 'Unmute group (all members can send messages)',
  category: 'group',
  filename: __filename,
  group: true,
  botAdmin: true,
  admin: true
}, async (conn, mek, m, { from, reply }) => {
  try {
    await conn.groupSettingUpdate(from, 'not_announcement');
    reply('Group unmuted: all members can send messages.');
  } catch (e) {
    reply('Failed to unmute group.');
  }
});

cmd({
  pattern: 'tagall',
  desc: 'Mention all group members',
  category: 'group',
  filename: __filename,
  group: true,
  admin: true
}, async (conn, mek, m, { from, reply }) => {
  try {
    const metadata = await conn.groupMetadata(from);
    const mentions = metadata.participants.map(p => p.id);
    await conn.sendMessage(from, { text: '@everyone', contextInfo: { mentionedJid: mentions } });
  } catch (e) {
    reply('Failed to tag all.');
  }
});

cmd({
  pattern: 'promote',
  desc: 'Promote a user to admin',
  category: 'group',
  filename: __filename,
  group: true,
  botAdmin: true,
  admin: true
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    let userJid;
    if (m.quoted) {
      userJid = m.quoted.sender;
    } else if (args[0]) {
      userJid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else return reply('Reply to user or provide number to promote.');

    await conn.groupParticipantsUpdate(from, [userJid], 'promote');
    reply('User promoted to admin.');
  } catch (e) {
    reply('Failed to promote user.');
  }
});

cmd({
  pattern: 'demote',
  desc: 'Demote an admin to member',
  category: 'group',
  filename: __filename,
  group: true,
  botAdmin: true,
  admin: true
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    let userJid;
    if (m.quoted) {
      userJid = m.quoted.sender;
    } else if (args[0]) {
      userJid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else return reply('Reply to user or provide number to demote.');

    await conn.groupParticipantsUpdate(from, [userJid], 'demote');
    reply('User demoted from admin.');
  } catch (e) {
    reply('Failed to demote user.');
  }
});

cmd({
  pattern: 'del',
  desc: 'Delete a message',
  category: 'group',
  filename: __filename,
  group: true,
  botAdmin: true
}, async (conn, mek, m, { from, reply }) => {
  try {
    if (!m.quoted) return reply('Reply to a message to delete it.');
    await conn.sendMessage(from, { delete: m.quoted.key });
  } catch (e) {
    reply('Failed to delete message.');
  }
});

cmd({
  pattern: 'removeall',
  desc: 'Remove all non-admin members',
  category: 'group',
  filename: __filename,
  group: true,
  botAdmin: true,
  admin: true
}, async (conn, mek, m, { from, reply }) => {
  try {
    const meta = await conn.groupMetadata(from);
    const nonAdmins = meta.participants.filter(p => !p.admin).map(p => p.id);
    for (const jid of nonAdmins) {
      await conn.groupParticipantsUpdate(from, [jid], 'remove');
    }
    reply(`Removed ${nonAdmins.length} members.`);
  } catch (e) {
    reply('Failed to remove members.');
  }
});

cmd({
  pattern: 'invite',
  desc: 'Invite user to group',
  category: 'group',
  filename: __filename,
  group: true,
  admin: true
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    if (!args[0]) return reply('Provide number to invite.');
    const userJid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    await conn.groupParticipantsUpdate(from, [userJid], 'add');
    reply('User invited.');
  } catch (e) {
    reply('Failed to invite user.');
  }
});

cmd({
  pattern: 'kick',
  desc: 'Kick user from group',
  category: 'group',
  filename: __filename,
  group: true,
  botAdmin: true,
  admin: true
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    let userJid;
    if (m.quoted) userJid = m.quoted.sender;
    else if (args[0]) userJid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    else return reply('Reply to user or provide number to kick.');

    await conn.groupParticipantsUpdate(from, [userJid], 'remove');
    reply('User kicked.');
  } catch (e) {
    reply('Failed to kick user.');
  }
});

cmd({
  pattern: 'groupinfo',
  desc: 'Show group info',
  category: 'group',
  filename: __filename,
  group: true
}, async (conn, mek, m, { from, reply }) => {
  try {
    const meta = await conn.groupMetadata(from);
    const admins = meta.participants.filter(p => p.admin).map(p => '@' + p.id.split('@')[0]);
    const desc = meta.desc || 'No description';
    const msg = `
*Group Info*

Name: ${meta.subject}
ID: ${meta.id}
Description: ${desc}
Admins: ${admins.join(', ')}
Participants: ${meta.participants.length}
Created At: ${new Date(meta.creation * 1000).toLocaleString()}
Owner: @${meta.owner.split('@')[0]}
    `;
    await conn.sendMessage(from, { text: msg, contextInfo: { mentionedJid: [meta.owner, ...meta.participants.map(p => p.id)] } });
  } catch (e) {
    reply('Failed to fetch group info.');
  }
});

cmd({
  pattern: 'setname',
  desc: 'Change group name',
  category: 'group',
  filename: __filename,
  group: true,
  botAdmin: true,
  admin: true
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    if (args.length < 1) return reply('Please provide a new group name.');
    const newName = args.join(' ');
    await conn.groupUpdateSubject(from, newName);
    reply(`Group name changed to: ${newName}`);
  } catch (e) {
    reply('Failed to change group name.');
  }
});

cmd({
  pattern: 'setdesc',
  desc: 'Change group description',
  category: 'group',
  filename: __filename,
  group: true,
  botAdmin: true,
  admin: true
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    if (args.length < 1) return reply('Please provide a new group description.');
    const newDesc = args.join(' ');
    await conn.groupUpdateDescription(from, newDesc);
    reply('Group description updated.');
  } catch (e) {
    reply('Failed to change group description.');
  }
});

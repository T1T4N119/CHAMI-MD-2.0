const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { cmd } = require('../lib/command');

cmd({
  pattern: 'mediafire',
  alias: ['mf'],
  desc: 'Download file from Mediafire link',
  category: 'download',
  react: '⬇️',
  filename: __filename,
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply('Please provide a Mediafire link.');

    if (!q.includes('mediafire.com')) return reply('Please provide a valid Mediafire URL.');

    // Fetch Mediafire page
    const res = await fetch(q);
    if (!res.ok) return reply('Failed to fetch the Mediafire page.');

    const html = await res.text();

    // Parse with cheerio
    const $ = cheerio.load(html);

    // Find the download button URL - usually inside a[aria-label="Download file"]
    const downloadUrl = $('a[aria-label="Download file"]').attr('href') || $('a#downloadButton').attr('href');

    if (!downloadUrl) return reply('Could not find direct download link.');

    // Optional: fetch headers to get file size and name
    const headRes = await fetch(downloadUrl, { method: 'HEAD' });
    const contentLength = headRes.headers.get('content-length');
    const contentType = headRes.headers.get('content-type');

    // Send download info + file as document
    const fileName = downloadUrl.split('/').pop().split('?')[0] || 'file';

    await conn.sendMessage(from, {
      document: { url: downloadUrl },
      fileName: fileName,
      mimetype: contentType,
      caption: `Downloaded from Mediafire\nFile: ${fileName}\nSize: ${contentLength ? (contentLength / (1024*1024)).toFixed(2) + ' MB' : 'Unknown'}`,
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply('Failed to download from Mediafire.');
  }
});

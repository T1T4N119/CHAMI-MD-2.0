const fetch = require('node-fetch');
const { cmd } = require('../lib/command');

cmd({
    pattern: "zoom",
    desc: "Search and download movies from zoom.lk",
    category: "movie",
    react: "🎬"
}, async (conn, mek, m, { text, reply }) => {
    if (!text) return reply("🔍 Search keyword එකක් දෙන්න. Example: .zoom deadpool");

    try {
        // Search movies
        let searchUrl = `https://zoom-lk-api.vercel.app/search?q=${encodeURIComponent(text)}`;
        let res = await fetch(searchUrl);
        let data = await res.json();

        if (!data || data.length === 0) return reply("😔 Movie එකක් හමු නොවුණා.");

        let msg = "🎬 *Zoom.lk Search Results:*\n\n";
        data.forEach((movie, index) => {
            msg += `${index + 1}. *${movie.title}*\n${movie.url}\n\n`;
        });
        msg += "_Reply with `.zoomdl <movie_url>` to download_";
        reply(msg);

    } catch (err) {
        console.error(err);
        reply("❌ Error searching movies.");
    }
});

cmd({
    pattern: "zoomdl",
    desc: "Download movie from zoom.lk",
    category: "movie",
    react: "⬇️"
}, async (conn, mek, m, { text, reply }) => {
    if (!text) return reply("📥 Movie page URL එකක් දෙන්න. Example: .zoomdl https://zoom.lk/...");

    try {
        // Get download info
        let dlUrl = `https://zoom-lk-api.vercel.app/dl?url=${encodeURIComponent(text)}`;
        let res = await fetch(dlUrl);
        let data = await res.json();

        if (!data || !data.download) return reply("❌ Download link not found.");

        let caption = `🎬 *${data.title}*\n📥 ${data.download}`;
        reply(caption);

    } catch (err) {
        console.error(err);
        reply("❌ Error fetching download link.");
    }
});

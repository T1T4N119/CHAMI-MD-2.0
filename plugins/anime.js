// slanime-scraper.js
const config = require('../settings')
const { cmd, commands } = require('../lib/command')
const { getBuffer } = require('../lib/functions')
const GDriveDl = require('../lib/gdrive.js'); // keep your gdrive helper
const axios = require('axios')
const cheerio = require('cheerio')

const N_FOUND = "*I couldn't find anything :(*"
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

async function fetchHTML(url) {
    const res = await axios.get(url, {
        headers: { 'User-Agent': UA, Referer: 'https://google.com' },
        timeout: 15000
    })
    return res.data
}

/**
 * Search slanimeclub site
 * returns array: [{ title, link, image }]
 */
async function searchSlanime(query) {
    const url = `https://slanimeclub.co/?s=${encodeURIComponent(query)}`
    const html = await fetchHTML(url)
    const $ = cheerio.load(html)
    const results = []

    // NOTE: site structure may vary — selectors below are common patterns
    $('.post,.items .item,article').each((i, el) => {
        const a = $(el).find('a').first()
        const link = a.attr('href') || ''
        const title = $(el).find('h2, .title, .entry-title').first().text().trim() || a.attr('title') || a.text().trim()
        let img = $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src') || ''
        if (img && img.startsWith('//')) img = 'https:' + img
        if (link && title) results.push({ title, link, image: img })
    })

    return results
}

/**
 * Get movie / tvshow details (seasons/episodes)
 * returns object { title, date, generous, image, seasons: [{ title, link, number, date }] }
 */
async function getMovieDetails(url) {
    const html = await fetchHTML(url)
    const $ = cheerio.load(html)
    const title = $('h1, .post-title, .entry-title').first().text().trim()
    const image = $('.post-thumb img, .entry-thumbnail img').first().attr('src') || ''
    const date = $('.post-date, .date, time').first().text().trim() || ''
    const generous = $('.genres, .tags, .meta .genre').first().text().trim() || ''

    const seasons = []
    // try episodes/season lists
    $('.episodes-list li, .season-list li, .post-content a').each((i, el) => {
        const a = $(el).find('a').first()
        const link = a.attr('href') || a.attr('data-href') || ''
        const sTitle = a.text().trim() || $(el).text().trim()
        // number/date attempts:
        const number = $(el).find('.ep-num').text().trim() || ''
        const sDate = $(el).find('.ep-date').text().trim() || ''
        if (link) seasons.push({ title: sTitle, link, number, date: sDate })
    })

    // fallback: check for direct download sections or single episode links
    if (seasons.length === 0) {
        $('a').each((i, el) => {
            const href = $(el).attr('href') || ''
            if (href.includes('/watch') || href.includes('/episode') || href.includes('/movies')) {
                const sTitle = $(el).text().trim() || title + ' ' + (i+1)
                seasons.push({ title: sTitle, link: href, number: `${i+1}`, date: '' })
            }
        })
    }

    return { title, date, generous, image, seasons }
}

/**
 * Given page URL (episode/movie page), find real download link or iframe src
 * returns { type: 'direct'|'drive'|'iframe'|'unknown', link }
 */
async function extractDownloadLink(pageUrl) {
    try {
        const html = await fetchHTML(pageUrl)
        const $ = cheerio.load(html)

        // 1) check for direct links in anchor tags that look like files
        let dl = ''
        $('a').each((i, el) => {
            const href = $(el).attr('href') || ''
            if (href.match(/\.(mp4|mkv|webm|zip)(\?|$)/i) || href.includes('download')) {
                if (!href.includes('mailto:')) dl = href
            }
        })
        if (dl) return { type: 'direct', link: dl }

        // 2) check for iframes (common embed)
        const iframe = $('iframe').first().attr('src') || $('iframe').first().attr('data-src') || ''
        if (iframe) {
            // iframe may be google drive, streamtape, or other host
            if (iframe.includes('drive.google.com') || iframe.includes('docs.google.com')) return { type: 'drive', link: iframe }
            return { type: 'iframe', link: iframe }
        }

        // 3) some pages embed JSON or scripts with sources
        let scriptLink = ''
        $('script').each((i, el) => {
            const txt = $(el).html() || ''
            // naive regex for .mp4 links in script
            const m = txt.match(/https?:\/\/[^"' ]+?\.(mp4|mkv|webm)(\?[^"' ]*)?/i)
            if (m) scriptLink = m[0]
            // google drive file id
            const gid = txt.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_\-]+)/)
            if (gid) scriptLink = `https://drive.google.com/file/d/${gid[1]}/view`
        })
        if (scriptLink) {
            if (scriptLink.includes('drive.google.com')) return { type: 'drive', link: scriptLink }
            return { type: 'direct', link: scriptLink }
        }

        return { type: 'unknown', link: pageUrl }
    } catch (err) {
        throw err
    }
}

/* ----------------- Commands ----------------- */

cmd({
    pattern: "slanimeclub",
    react: '📑',
    category: "movie",
    desc: "slanimeclub movie downloader (scraper)",
    filename: __filename
}, async (conn, m, mek, { from, prefix, q, l, reply }) => {
    try {
        if (!q) return await reply('*Please Give Me Text..! 🖊️*')

        const results = await searchSlanime(q)
        if (!results.length) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek })

        const srh = results.map((item, i) => ({
            title: `${i + 1}`,
            description: item.title,
            rowId: `${prefix}slanime ${item.link}`
        }))

        const sections = [{ title: "_[Result from slanimeclub.]_", rows: srh }]
        const listMessage = {
            text: '',
            footer: config.FOOTER,
            title: 'Result from slanimeclub. 📲',
            buttonText: '*🔢 Reply below number*',
            sections
        }

        return await conn.replyList(from, listMessage, { quoted: mek })
    } catch (e) {
        console.error(e)
        reply('*ERROR !!*')
    }
})

cmd({
    pattern: "slanime",
    react: '📑',
    category: "movie",
    desc: "slanimeclub movie downloader (scraper)",
    filename: __filename
}, async (conn, m, mek, { from, prefix, q, l, reply }) => {
    try {
        if (!q) return await reply('*Please Give Me Text..! 🖊️*')

        if (q.includes("https://slanimeclub.co")) {
            const movie = await getMovieDetails(q)
            if (!movie || !movie.seasons?.length) return await reply(N_FOUND)

            const cap = `*_\u2618 Title: ${movie.title || 'N/A'} _*\n\n- *Date:* ${movie.date || 'N/A'}\n- *Genres:* ${movie.generous || 'N/A'}\n\n*\u2692\ufe0f Link:* ${q}`

            const srh = movie.seasons.map((s, i) => ({
                title: `${i + 1}`,
                description: `${s.title} | ${s.number || 'N/A'} | ${s.date || 'N/A'}`,
                rowId: `${prefix}slanimedl ${s.link}|${s.title || movie.title || 'download'}`
            }))

            const sections = [{ title: "_[Result from slanimeclub.]_", rows: srh }]
            const listMessage = {
                caption: cap,
                image: { url: movie.image || '' },
                footer: config.FOOTER,
                title: 'Result from slanimeclub. 📲',
                buttonText: '*🔢 Reply below number*',
                sections
            }
            return await conn.replyList(from, listMessage, { quoted: mek })
        } else {
            return await reply('*Please provide a slanimeclub URL.*')
        }
    } catch (e) {
        console.error(e)
        reply('*ERROR !!*')
    }
})

cmd({
    pattern: 'slanimedl',
    react: "📥",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return await reply('*Please provide a direct URL!*')

    try {
        const [mediaUrl, title = 'tdd_movie_dl_system'] = q.split("|")
        await reply('╭═════════════════❀\n│  UPLOADING YOUR MOVIE 📥\n│ ❀ Target : WAIT FEW MINUTES...\n╰═════════════════❀')

        const extracted = await extractDownloadLink(mediaUrl)
        const dl_link = extracted.link

        if (!dl_link) return await reply('*Unable to fetch download link.*')

        if (extracted.type === 'direct') {
            // direct file
            const buffer = await getBuffer(dl_link)
            const message = {
                document: buffer,
                caption: `${title}\n\n${config.FOOTER}`,
                mimetype: "video/mp4",
                fileName: `${title}.mp4`
            }
            await conn.sendMessage(from, message)
        } else if (extracted.type === 'drive' || dl_link.includes('drive.google.com')) {
            // use your existing GDriveDl helper to resolve
            const res = await GDriveDl(dl_link)
            if (res?.downloadUrl) {
                const info = `*[ Downloading file ]*\n\n*Name :* ${res.fileName}\n*Size :* ${res.fileSize}\n*Type :* ${res.mimetype}`
                await reply(info)
                await conn.sendMessage(from, {
                    document: { url: res.downloadUrl },
                    caption: `${res.fileName}\n\n${config.FOOTER}`,
                    fileName: res.fileName,
                    mimetype: res.mimetype
                }, { quoted: mek })
            } else {
                await reply('*Google Drive Link is not downloadable.*')
            }
        } else if (extracted.type === 'iframe') {
            // try to follow iframe to find final link
            if (dl_link.includes('streamtape') || dl_link.includes('ok.ru') || dl_link.includes('yourupload')) {
                // optionally add host-specific resolvers here
                await reply(`*Found iframe:* ${dl_link}\nTry using host-specific resolver or open in browser.`)
            } else {
                await reply(`*Found embed:* ${dl_link}\nTry opening in browser or use host resolver.`)
            }
        } else {
            await reply('*Unsupported or unknown download link format.*')
        }

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } })
    } catch (error) {
        console.error('Error fetching or sending:', error)
        await reply('*Error fetching or sending*')
    }
})

module.exports = { /* exported if needed */ }        

        const listMessage = {
            text: '',
            footer: config.FOOTER,
            title: 'Result from slanimeclub. 📲',
            buttonText: '*🔢 Reply below number*',
            sections
        }

        return await conn.replyList(from, listMessage, { quoted: mek })
        
        }
        
    } catch (e) {
        reply('*ERROR !!*')
        l(e)
    }
})

cmd({
    pattern: 'slanimedl',
    react: "📥",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return await reply('*Please provide a direct URL!*')

    try {
        const [mediaUrl, title = 'tdd_movie_dl_system'] = q.split("|")

        const data = await fetchJson(`https://vajira-movie-api.vercel.app/api/slanimeclub/download?url=${mediaUrl}&apikey=vajiraofficial`)
        const dl_link = data?.data?.data?.link

        if (!dl_link) return await reply('*Unable to fetch download link.*')

        await reply('╭═════════════════❀\n│  UPLOADING YOUR MOVIE 📥\n│ ❀ Target : WAIT FEW MINUTES...\n│ ❀ Use commands after come the movie\n│ ❀ Device : 1/3\n╰═════════════════❀')

        if (dl_link.includes("slanimeclub.co")) {
            const message = {
                document: await getBuffer(dl_link),
                caption: `${title}\n\n${config.FOOTER}`,
                mimetype: "video/mp4",
                fileName: `${title}.mp4`
            }
            await conn.sendMessage(from, message)

        } else if (dl_link.includes("drive.google.com")) {
            const res = await GDriveDl(dl_link)

            if (res?.downloadUrl) {
                const txt = `*[ Downloading file ]*\n\n*Name :* ${res.fileName}\n*Size :* ${res.fileSize}\n*Type :* ${res.mimetype}`
                await reply(txt)
                await conn.sendMessage(from, {
                    document: { url: res.downloadUrl },
                    caption: `${res.fileName}\n\n${config.FOOTER}`,
                    fileName: res.fileName,
                    mimetype: res.mimetype
                }, { quoted: mek })
            } else {
                await reply('*Google Drive Link is not downloadable.*')
            }
        } else {
            await reply('*Unsupported download link format.*')
        }

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } })

    } catch (error) {
        console.error('Error fetching or sending:', error)
        await reply('*Error fetching or sending*')
    }
})

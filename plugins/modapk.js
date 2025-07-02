const { cmd } = require('../lib/command')
const axios = require('axios')
const cheerio = require('cheerio')
const { sendFileFromUrl } = require('../lib')

cmd({
  pattern: "modapk",
  desc: "Download APK/Mod from APKPure",
  category: "downloader",
  use: ".modapk <app name>",
  react: '📦'
}, async (m, text) => {
  if (!text) return m.reply('🔍 *Please enter app name.*\nExample: *.modapk subway surfers*')

  try {
    const searchUrl = `https://apkpure.com/search?q=${encodeURIComponent(text)}`
    const res = await axios.get(searchUrl)
    const $ = cheerio.load(res.data)
    const firstResult = $('p.title > a').first()

    if (!firstResult.attr('href')) return m.reply('❌ App not found.')

    const appPage = `https://apkpure.com${firstResult.attr('href')}`
    const appRes = await axios.get(appPage)
    const $$ = cheerio.load(appRes.data)

    const downloadBtn = $$('a.da').attr('href')
    const appName = $$('h1').text().trim()
    const icon = $$('img[itemprop="image"]').attr('src')
    const desc = $$('div.description').text().trim()

    if (!downloadBtn) return m.reply('❌ Failed to get download link.')

    await m.reply(`✅ *Found:* ${appName}\n📥 *Downloading...*`)

    await sendFileFromUrl(m.chat, downloadBtn, m, {
      filename: `${appName}.apk`,
      caption: `📱 *${appName}*\n\n📝 ${desc}`
    }, { thumbnail: icon })

  } catch (e) {
    console.error(e)
    m.reply('❌ Error fetching app. Please try a different name.')
  }
})

const { cmd } = require('../lib/command')
const fs = require('fs')
const path = require('path')

const configPath = path.join(__dirname, '../config.js')

cmd({
  pattern: 'alwaysonline',
  desc: 'Change alwaysOnline value',
  category: 'owner',
  use: ':true / :false',
  filename: __filename,
  react: '🟢',
  fromMe: true
}, async (m, text) => {
  const input = text.trim().toLowerCase()

  if (!input.includes(':')) return m.reply('Example: .alwaysonline:true or .alwaysonline:false')

  const value = input.split(':')[1]
  if (value !== 'true' && value !== 'false') return m.reply('Invalid value! Use true or false.')

  let config = fs.readFileSync(configPath, 'utf-8')
  let updated = config.replace(/alwaysOnline:\s*(true|false)/, `alwaysOnline: ${value}`)
  fs.writeFileSync(configPath, updated)

  m.reply(`✅ alwaysOnline has been set to *${value.toUpperCase()}*.\nRestarting bot to apply changes...`)

  setTimeout(() => {
    process.exit(0)
  }, 2000)
})

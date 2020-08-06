const Discord = require('discord.js')
const dayjs = require('dayjs')
let auth = {
    token: process.env.BOT_TOKEN
}

if (!auth.token) {
    auth = require('./auth.json')
}

const myId = '740656002717712436'
const rickyId = '312280771585114144'

const powderEmojiId = '558693114986889218'
const headEmojiId = '740968747832967262'
const warhammerEmojiId = '558686875930591234'

// Initialize Discord Bot
const client = new Discord.Client()

const amsterdamDate = dayjs('2020-09-24T16:05:00.000Z')
let lastDayDone = dayjs().date() - 1

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  // const currentDate = dayjs()
  // const secondsToAmsterdam = amsterdamDate.diff(currentDate, "second")
  // const timeToAmsterdam = secondsToDhms(secondsToAmsterdam)
  // console.log(timeToAmsterdam)
})

client.on('message', msg => {
    // calculate time to amsterdam
    const currentDate = dayjs()
    const secondsToAmsterdam = amsterdamDate.diff(currentDate, "second")
    const timeToAmsterdam = secondsToDhms(secondsToAmsterdam)

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (msg.content.substring(0, 1) == '!') {
        let args = msg.content.substring(1).split(' ')
        let cmd = args[0]
       
        args = args.splice(1)
        switch(cmd) {
            case 'amsterdam':
                msg.reply(`only ${timeToAmsterdam} left until Amsterdam`)
                break;
            case 'dam':
                msg.reply(`only ${timeToAmsterdam} left until Amsterdam`)
                break;
            case 'ams':
                msg.reply(`only ${timeToAmsterdam} left until Amsterdam`)
                break;
            case 'amst':
                msg.reply(`only ${timeToAmsterdam} left until Amsterdam`)
                break;
        }
    }

    if (msg.content.toLowerCase() === 'what') {
        msg.reply('fuck off noob')
    }

    if (!sentByMe(msg) && msg.tts) {
        msg.reply("don't use tts retard", { tts: true })
    }

    if (oneInX(5000)) {
        msg.react(warhammerEmojiId)
        msg.reply("you rolled a Dragon Warhammer with that message")
    }

    if (sentByRicky(msg) && oneInX(15)) {
        msg.react(powderEmojiId)
        msg.react(headEmojiId)
    }

    // If we haven't posted today, post a message to the channel
    if (lastDayDone !== dayjs().date()) {
        msg.channel.send(`Only ${timeToAmsterdam} left until Amsterdam btw`)
        lastDayDone = dayjs().date()
    }
})

let secondsToDhms = seconds => {
  let d = Math.floor(seconds / (3600*24))
  let h = Math.floor(seconds % (3600*24) / 3600)
  let m = Math.floor(seconds % 3600 / 60)
  let s = Math.floor(seconds % 60)

  let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : ""
  let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
  let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
  let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""

  return dDisplay + hDisplay + mDisplay + 'and ' + sDisplay
}

let oneInX = x => {
    return Math.floor(Math.random() * x) === 0
}

let sentByMe = msg => {
    return msg.author.id == myId
}

let sentByRicky = msg => {
    return msg.author.id == rickyId
}

client.login(auth.token)
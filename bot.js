const Discord = require('discord.js')
const dayjs = require('dayjs')
let auth = {
    token: process.env.BOT_TOKEN
}

if (!auth.token) {
    auth = require('./auth.json')
}

// User IDs
const myId = '740656002717712436'
const rickyId = '312280771585114144'
const learyId = '349148329470328835'

// Emoji IDs
const powderEmojiId = '558693114986889218'
const headEmojiId = '740968747832967262'
const warhammerEmojiId = '558686875930591234'
const learyEmojiId = '558690186356064256'

// Audio Clips
const gordonClip = 'resources/audio/gordon.mp3'
const wesClip = 'resources/audio/wes.mp3'
const originClip = 'resources/audio/originClip.mp3'
const rickyMumClip = 'resources/audio/rickyMumClip.mp3'

// Image URLs
const redKeyCardBunkersImage = 'https://i.imgur.com/VTaY0Y6.png'
const tierFiveLootImage = 'https://i.imgur.com/mmh9eQA.jpg'
const codesForBunkersImage = 'https://i.imgur.com/vCxtBzE.jpg'
const subwayLocationsImage = 'https://i.imgur.com/lH2NKnJ.png'

// Command List
const commandList = [
    { name: '!commands', value: 'List all of the commands' },
    { name: '!gordon', value: 'Play gordon clip' },
    { name: '!wes', value: 'Play wes clip' },
    { name: '!origin', value: 'Play origin clip' },
    { name: '!red, !bunkers', value: 'Show the locations of the red access card bunkers' },
    { name: '!ricky', value: 'Play the ricky mum clip' },
    { name: '!codes', value: 'Show the locations of the code bunkers' },
    { name: '!t5, !t5loot, !highloot', value: 'Show the locations of the t5 loot' },
    { name: '!subway', value: 'Show the locations of the subway stations' }
]

// Initialize Discord Bot
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const getCommandsMessage = () => {
    return new Discord.MessageEmbed()
      .setTitle('Commands')
      .setColor(0xff0000)
      .addFields(commandList)
}

client.on('message', async msg => {
    if (msg.content.substring(0, 1) == '!') {
        let args = msg.content.substring(1).split(' ')
        let cmd = args[0]
        cmd = cmd.toLowerCase()
       
        args = args.splice(1)
        switch(cmd) {
            case 'commands':
                const embedCommandMessage = getCommandsMessage()
                msg.channel.send(embedCommandMessage)
                break;
            case 'gordon':
                await sneakInVoice(msg, gordonClip)
                break;
            case 'wes':
                await sneakInVoice(msg, wesClip)
                break;
            case 'origin':
                await sneakInVoice(msg, originClip)
                break;
            case 'red':
                msg.reply(redKeyCardBunkersImage)
                break;
            case 'bunkers':
                msg.reply(redKeyCardBunkersImage)
                break;
            case 'ricky':
                await sneakInVoice(msg, rickyMumClip)
                break;
            case 'codes':
                msg.reply(codesForBunkersImage)
                break;
            case 't5':
                msg.reply(tierFiveLootImage)
                break;
            case 'highloot':
                msg.reply(tierFiveLootImage)
                break;
            case 't5loot':
                msg.reply(tierFiveLootImage)
                break;
            case 'subway':
                msg.reply(subwayLocationsImage)
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
        msg.reply("you rolled a Dragon Warhammer with that message gz")
    }


    if (sentByRicky(msg) && oneInX(15)) {
        msg.react(powderEmojiId)
        msg.react(headEmojiId)
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

let sentByLeary = msg => {
    return msg.author.id == learyId
}

let sneakInVoice = async (requesterMsg, audioClip) => {
    const channel = requesterMsg.member.voice.channel
    if (channel) {
        const connection = await channel.join()
        const dispatcher = connection.play(audioClip)

        dispatcher.setVolume(0.5)

        dispatcher.on('start', () => {
            console.log(`playing ${audioClip}`)
        })

        dispatcher.on('finish', () => {
            console.log(`finished playing ${audioClip}`)
            channel.leave()
        })

        dispatcher.on('error', console.error);

    } else {
        console.log('not in voice?')
    }
}

client.login(auth.token)
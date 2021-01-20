const Discord = require('discord.js')
const dayjs = require('dayjs')

const StakingClient = require('./StakingClient.js')
const GraphicalStakingClient = require('./GraphicalStakingClient.js')
const clearTempDirectory = require(`${__dirname}/util/clearTempDirectory.js`)

let auth = {
    token: process.env.BOT_TOKEN
}

if (!auth.token) {
    auth = require(`${__dirname}/../auth.json`)
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
const vicksEmojiId = '779424620360368189'

// Audio Clips
const gordonClip = `${__dirname}/../resources/audio/gordon.mp3`
const wesClip = `${__dirname}/../resources/audio/wes.mp3`
const originClip = `${__dirname}/../resources/audio/originClip.mp3`
const rickyMumClip = `${__dirname}/../resources/audio/rickyMumClip.mp3`
const rlKidClip = `${__dirname}/../resources/audio/rlkid.mp3`
const rickyKylieClip = `${__dirname}/../resources/audio/ricky2.mp3`
const rickyKidClip = `${__dirname}/../resources/audio/ricky3.mp3`

// Image URLs
const redKeyCardBunkersImage = 'https://i.imgur.com/Q2U1NoI.png'
const tierFiveLootImage = 'https://i.imgur.com/mmh9eQA.jpg'
const tierFourLootImage = 'https://i.imgur.com/rrEWws4.jpeg'
const t4t5LootImage = 'https://i.imgur.com/iCJdaFH.jpg'
const codesForBunkersImage = 'https://i.imgur.com/vCxtBzE.jpg'
const subwayLocationsImage = 'https://i.imgur.com/lH2NKnJ.png'
const stadiumRoomsMapImage = 'https://i.imgur.com/l0ferw7.png'
const blackMarketImage = 'https://i.imgur.com/niGJLCa.jpg'

// Text
const stadiumRoomLocations = 'P216 - Parking lot level (bottom), CL19 - Concourse level (middle), EL21 - Executive level (top)'

// Command List
const commandList = [
    { name: '!commands', value: 'List all of the commands' },
    { name: '!gordon', value: 'Play gordon clip' },
    { name: '!wes', value: 'Play wes clip' },
    { name: '!origin', value: 'Play origin clip' },
    { name: '!red, !redaccesscard, !bunkers', value: 'Show the locations of the red access card bunkers' },
    { name: '!blue, !blueaccesscard, !stadium', value: 'Show the locations of the stadium access card rooms' },
    { name: '!ricky', value: 'Play the ricky mum clip' },
    { name: '!ricky2', value: 'Play the ricky kylie jenner clip' },
    { name: '!ricky3', value: 'Play the ricky kid clip' },
    { name: '!rlkid', value: 'Play the RL kid clip' },
    { name: '!codes', value: 'Show the locations of the code bunkers' },
    { name: '!t5, !t5loot', value: 'Show the locations of the t5 loot' },
    { name: '!t4, !t4loot', value: 'Show the locations of the t4 loot' },
    { name: '!t4t5, !t5t4, !t4+t5, !t4&t5, !highloot', value: 'Show the locations of t4 and t5 loot' },
    { name: '!subway', value: 'Show the locations of the subway stations' },
    { name: '!stake <player1> <player2>', value: 'Stake player1 vs player2'},
    { name: '!summon @player', value: 'Summon @player to voice channel' },
    { name: '!blackmarket, !black, !bm', value: 'Show the black market prices for the divinity Dayz server' }
]

// Initialize Discord Bot
const client = new Discord.Client()

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity('!commands', { type: 'PLAYING' })
    clearTempDirectory()
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
                break
            case 'gordon':
                await sneakInVoice(msg, gordonClip)
                break
            case 'wes':
                await sneakInVoice(msg, wesClip)
                break
            case 'origin':
                await sneakInVoice(msg, originClip)
                break
            case 'red':
                msg.reply(redKeyCardBunkersImage)
                break
            case 'bunkers':
                msg.reply(redKeyCardBunkersImage)
                break
            case 'redaccesscard':
                msg.reply(redKeyCardBunkersImage)
                break
            case 'ricky':
                await sneakInVoice(msg, rickyMumClip)
                break
            case 'ricky2':
                await sneakInVoice(msg, rickyKylieClip)
                break
            case 'ricky3':
                await sneakInVoice(msg, rickyKidClip)
                break
            case 'codes':
                msg.reply(codesForBunkersImage)
                break
            case 't5':
                msg.reply(tierFiveLootImage)
                break
            case 't5loot':
                msg.reply(tierFiveLootImage)
                break
            case 't4':
                msg.reply(tierFourLootImage)
                break
            case 't4loot':
                msg.reply(tierFourLootImage)
                break
            case 't4t5':
                msg.reply(t4t5LootImage)
                break
            case 't5t4':
                msg.reply(t4t5LootImage)
                break
            case 't4+t5':
                msg.reply(t4t5LootImage)
                break
            case 't4&t5':
                msg.reply(t4t5LootImage)
                break
            case 'highloot':
                msg.reply(t4t5LootImage)
                break
            case 'subway':
                msg.reply(subwayLocationsImage)
                break
            case 'rlkid':
                await sneakInVoice(msg, rlKidClip)
                break
            case 'blue':
                msg.reply(stadiumRoomsMapImage)
                msg.reply(stadiumRoomLocations)
                break
            case 'blueaccesscard':
                msg.reply(stadiumRoomsMapImage)
                msg.reply(stadiumRoomLocations)
                break
            case 'stadium':
                msg.reply(stadiumRoomsMapImage)
                msg.reply(stadiumRoomLocations)
                break
            case 'stake':
                await stakeHandler(msg, args)
                break
            case 'summon':
                await summon(msg)
                break
            case 'blackmarket':
                msg.reply(blackMarketImage)
                break
            case 'black':
                msg.reply(blackMarketImage)
                break
            case 'bm':
                msg.reply(blackMarketImage)
                break
        }
    }

    if (msg.content.toLowerCase().includes('what') && !sentByMe(msg)) {
        const response = msg.content.replace(/\s*what\s*/g, ' **what** ')
        console.log(response)
        msg.reply(response)
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

    if (sentByLeary(msg) && oneInX(15)) {
        msg.react(vicksEmojiId)
    }
})

const secondsToDhms = seconds => {
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

const oneInX = x => {
    return Math.floor(Math.random() * x) === 0
}

const sentByMe = msg => {
    return msg.author.id == myId
}

const sentByRicky = msg => {
    return msg.author.id == rickyId
}

const sentByLeary = msg => {
    return msg.author.id == learyId
}

const sneakInVoice = async (requesterMsg, audioClip) => {
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

const stakeHandler = async (msg, args) => {
    let validCall = true
    if (args.length !== 2) {
        msg.reply('**Usage:** *!stake player1 player2*')
        validCall = false
    }

    if (validCall) {
        const stakingClient = new GraphicalStakingClient(msg.channel, args[0], args[1]) // StakingClient(msg.channel, args[0], args[1]) for text + static image based stake
        await stakingClient.stake()
    }
}

const summon = async (msg) => {
    try {
        const userId = msg.mentions.users.first().id
        const message = `<@${userId}> you have been summoned`

        const user = msg.guild.members.cache.get(userId)

        user.send('You have been summoned brother please join voice chat')

        msg.channel.send(message, { tts: true })
    } catch (e) {}
}

client.login(auth.token)

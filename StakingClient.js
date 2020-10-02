const MAX_HIT = 25
const { MessageAttachment } = require('discord.js')

class StakingClient {
	constructor(channel, player1, player2) {
		this.channel = channel
		this.player1 = player1
		this.player2 = player2
		this.player1HP = 100
		this.player2HP = 100
	}

	async stake() {
		let hitter = Math.floor(Math.random() * 2) + 1 // Who hits first
		const pidPlayer = hitter === 1 ? this.player1 : this.player2

		const coinsImage = new MessageAttachment('./resources/images/staking/coins.png')

		let stakingEmbed
		let lastEmbedMessage = { delete: () => {} }
		let lastDamageDone = 0
		let lastHitsplatImage = null

		while (this.player1HP > 0 && this.player2HP > 0) {
			await new Promise(resolve => setTimeout(resolve, 2400)) // wait ~ 4 runescape ticks

			const damageDone = this.doTurn(hitter)
			const hitsplatImage = new MessageAttachment(`./resources/images/staking/hitsplats/${damageDone}.png`)
			
			const embedMessage = await this.channel.send({
				files: [hitsplatImage, coinsImage],
				embed: this.generateEmbed(damageDone, pidPlayer)
			})
			lastEmbedMessage.delete()

			lastEmbedMessage = embedMessage
			lastDamageDone = damageDone
			lastHitsplatImage = hitsplatImage

			hitter = hitter === 1 ? 2 : 1 // flip the hitter
		}

		await this.channel.send({
			files: [lastHitsplatImage, coinsImage],
			embed: this.generateEmbed(lastDamageDone, pidPlayer, `${this.player1HP === 0 ? this.player2 : this.player1}`)
		})
	}

	doTurn(hitter) {
		let damageDone

		if (hitter === 1) {
			damageDone = this.getHit()
			this.player2HP -= damageDone
			this.player2HP = Math.max(0, this.player2HP)
		} else {
			damageDone = this.getHit()
			this.player1HP -= damageDone
			this.player1HP = Math.max(0, this.player1HP)
		}

		return damageDone
	}

	getHit() {
		return Math.floor(Math.random() * MAX_HIT)
	}

	generateEmbed(damageDone, pidPlayer, winner) {
		const embed = {
			color: 0x3a3325,
			title: 'Staking',
			thumbnail: {
				url: 'attachment://coins.png',
			},
			fields: [
				{
					name: `${this.player1} vs ${this.player2} (${pidPlayer} has pid)`,
					value: '\u200b',
				},
				{
					name: `${winner ? `${winner} wins!` : '\u200b'}`,
					value: '\u200b',
					inline: false,
				},
				{
					name: this.player1,
					value: this.player1HP,
					inline: true,
				},
				{
					name: '\u200b',
					value: '\u200b',
					inline: true,
				},
				{
					name: this.player2,
					value: this.player2HP,
					inline: true,
				},
			],
			image: {
				url: `attachment://${damageDone}.png`,
			}
		}

		return embed
	}
}

module.exports = StakingClient
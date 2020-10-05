const MAX_HIT = 25
const { MessageAttachment } = require('discord.js')

/**
 * A basic Staking client with methods to perform an embed stake session with simple hitsplat images
 */
class StakingClient {
	constructor(channel, player1, player2) {
		this.channel = channel
		this.player1 = player1
		this.player2 = player2
		this.player1HP = 100
		this.player2HP = 100
		this.hitter = Math.floor(Math.random() * 2) + 1 // Who hits first
		this.COINS_IMAGE = new MessageAttachment('./resources/images/staking/coins.png')
	}

	async stake() {
		console.log('publishing pidder')
		// Inform players who has pid
		this.channel.send(`${this.hitter === 1 ? this.player1 : this.player2} has pid`)

		// Setup
		let stakingEmbed
		let lastEmbedMessage = { delete: () => {} }
		let lastDamageDone = 0
		let lastStakeImage = null

		// Game loop
		while (this.player1HP > 0 && this.player2HP > 0) {
			console.log('in loop')
			await new Promise(resolve => setTimeout(resolve, 1200)) // wait ~2 runescape ticks

			const damageDone = this.doTurn()
			const stakeImage = this.nextStakeImage(damageDone)

			console.log('in loop 2')
			
			try {
				const embedMessage = await this.channel.send({
					files: [stakeImage, this.COINS_IMAGE],
					embed: this.generateEmbed(damageDone)
				})
				console.log('in loop 3')
				lastEmbedMessage.delete()

				lastEmbedMessage = embedMessage
				lastDamageDone = damageDone
				lastStakeImage = stakeImage
			} catch (e) {
				console.error(e)
			}
		}

		console.log('finished loop')

		// Publish results
		await this.channel.send({
			files: [lastStakeImage, this.COINS_IMAGE],
			embed: this.generateEmbed(lastDamageDone, `${this.player1HP === 0 ? this.player2 : this.player1}`)
		})
		lastEmbedMessage.delete()
	}

	nextStakeImage(damageDone) {
		return new MessageAttachment(`./resources/images/staking/hitsplats/${damageDone}.png`)
	}

	doTurn() {
		let damageDone

		if (this.hitter === 1) {
			damageDone = this.getHit()
			this.player2HP -= damageDone
			this.player2HP = Math.max(0, this.player2HP)
			this.hitter = 2
		} else {
			damageDone = this.getHit()
			this.player1HP -= damageDone
			this.player1HP = Math.max(0, this.player1HP)
			this.hitter = 1
		}

		return damageDone
	}

	getHit() {
		return Math.floor(Math.random() * MAX_HIT)
	}

	generateEmbed(stakeImage, winner) {
		const embed = {
			color: 0x3a3325,
			title: 'Staking Local',
			thumbnail: {
				url: 'attachment://coins.png',
			},
			fields: [
				{
					name: `${this.player1} vs ${this.player2}`,
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
				url: `attachment://${stakeImage}.png`,
			}
		}

		return embed
	}
}

module.exports = StakingClient

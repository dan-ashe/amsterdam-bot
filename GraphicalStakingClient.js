const { createCanvas, loadImage, registerFont } = require('canvas')
const { v4: uuid } = require('uuid')
const fs = require('fs')

const StakingClient = require('./StakingClient.js')

registerFont('./resources/fonts/runescape_uf.ttf', { family: 'Runescape Font' })

const templateMetadata = [
	{
		fileName: './resources/images/staking/templates/duelTemplate.png',
		templateDimensions: {
			width: 175,
			height: 190
		},
		player1: {
			nameLocation: { x: 34, y: 8 },
			hitsplatLocation: { x: 4, y: 76 },
			healthLocation: { x: 4, y: 16 }
		},
		player2: {
			nameLocation: { x: 146, y: 22 },
			hitsplatLocation: { x: 136, y: 106 },
			healthLocation: { x: 144, y: 33 }
		}
	}
]

// The template to use
const TEMPLATE_TO_USE = 0

class GraphicalStakingClient extends StakingClient {
	constructor(channel, player1, player2) {
		super(channel, player1, player2)
		this.stakeId = uuid()
	}

	// Override
	async stake() {
		this.generateStakeTemplate()
		super.stake()
	}

	// Override
	async nextStakeImage(damageDone) {
		const canvasDimensions = templateMetadata[TEMPLATE_TO_USE].templateDimensions
		const canvas = createCanvas(canvasDimensions.width, canvasDimensions.height)

		const context = canvas.getContext('2d')

		// Add the background template image
		const templateBackground = await loadImage(`./temp/${this.stakeId}/template.png`)
		context.drawImage(templateBackground, 0, 0, canvasDimensions.width, canvasDimensions.height)

		// Draw the HP bars
		const player1HPBarLocation = templateMetadata[TEMPLATE_TO_USE].player1.healthLocation
		const player2HPBarLocation = templateMetadata[TEMPLATE_TO_USE].player2.healthLocation
		const player1HPBar = await loadImage(`./resources/images/staking/healthbars/${this.player1HP}`)
		const player2HPBar = await loadImage(`./resources/images/staking/healthbars/${this.player2HP}`)

		context.drawImage(player1HPBar, player1HPBarLocation.x, player1HPBarLocation.y)
		context.drawImage(player2HPBar, player2HPBarLocation.x, player2HPBarLocation.y)

		// Draw the hit splat
		const hitsplatImage = await loadImage(`./resources/images/staking/smaller_hitsplats/${damageDone}.png`)
		let hitsplatLocation

		if (this.hitter === 1) {
			hitsplatLocation = templateMetadata[TEMPLATE_TO_USE].player1.hitsplatLocation
		} else {
			hitsplatLocation = templateMetadata[TEMPLATE_TO_USE].player2.hitsplatLocation
		}
		context.drawImage(hitsplatImage, hitsplatLocation.x, hitsplatLocation.y)

		// Save the image to this stake's folder
		const buffer = canvas.toBuffer('image/png')
		fs.writeFileSync(`./temp/${this.stakeId}/template.png`, buffer)

		return new MessageAttachment(`./resources/images/staking/hitsplats/${damageDone}.png`)
	}


	// To save resources, generate a template image with the names of the players already added
	// to it so that we dont have to do that part for every frame. This should be called once at the start of a stake.
	async generateStakeTemplate() {
		const canvasDimensions = templateMetadata[TEMPLATE_TO_USE].templateDimensions
		const canvas = createCanvas(canvasDimensions.width, canvasDimensions.height)

		const context = canvas.getContext('2d')

		// Add the background template image
		const templateBackground = await loadImage(templateMetadata[TEMPLATE_TO_USE].fileName)
		context.drawImage(templateBackground, 0, 0, canvasDimensions.width, canvasDimensions.height)

		// Add the names on top of the background template image
		context.font = '15px "Runescape Font"'
		context.textAlign = 'center'
		context.textBaseline = 'middle'
		context.fillStyle = '#fff'

		const player1NameLocation = templateMetadata[TEMPLATE_TO_USE].player1.nameLocation
		const player2NameLocation = templateMetadata[TEMPLATE_TO_USE].player2.nameLocation

		context.fillText(this.player1Name, player1NameLocation.x, player1NameLocation.y)
		context.fillText(this.player2Name, player2NameLocation.x, player2NameLocation.y)

		// Create the temp folder for this stake's files to live in
		if (!fs.existsSync(`./temp/${this.stakeId}`)) {
			fs.mkdirSync(`./temp/${this.stakeId}`)
		}

		const buffer = canvas.toBuffer('image/png')
		fs.writeFileSync(`./temp/${this.stakeId}/template.png`, buffer)
	}
}

module.exports = GraphicalStakingClient
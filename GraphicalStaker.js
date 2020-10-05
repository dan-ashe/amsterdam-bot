const { createCanvas, loadImage, registerFont } = require('canvas')
const fs = require('fs')

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
			hitsplatLocation: { x: 0, y: 0 },
			healthLocation: { x: 0, y: 0 }
		},
		player2: {
			nameLocation: { x: 146, y: 22 },
			hitsplatLocation: { x: 0, y: 0 },
			healthLocation: { x: 0, y: 0 }
		}
	}
]

// The template to use
const TEMPLATE_TO_USE = 0

class GraphicalStaker {
	constructor(player1Name, player2Name, pidPlayer) {
		this.player1Name = player1Name
		this.player2Name = player2Name
		this.turn = pidPlayer
	}

	// Get the next image for this stake session
	nextFrame(damageDone) {


		// Change who's turn it is next
		this.turn = this.turn === 1 ? 2 : 1
	}

	// To save resources, generate a template image with the names of the players already added
	// to it so that we dont have to do that part for every frame. This should be called once,
	// after calling the constructor and before anything else.
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

		const buffer = canvas.toBuffer('image/png')
		fs.writeFileSync(`./test.png`, buffer)
	}
}

module.exports = GraphicalStaker
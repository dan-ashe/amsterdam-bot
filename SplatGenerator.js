const { createCanvas, loadImage, registerFont } = require('canvas')
const fs = require('fs')

registerFont('./resources/fonts/runescape_uf.ttf', { family: 'Runescape Font' })

/**
 * Code used to generate the runescape hit splats
 *
 * @param {int} numToGenerate the number of hitsplats to generate, starting at 0
 */
module.exports = async numToGenerate => {
	for (let i = 0; i < numToGenerate; i++) {
		const width = 48
		const height = 44

		const canvas = createCanvas(width, height)
		const context = canvas.getContext('2d')

		let hitsplatImage
		if (i === 0) {
			hitsplatImage = await loadImage('./resources/images/staking/hitsplats/plain_blue_hitsplat.png')
		} else {
			hitsplatImage = await loadImage('./resources/images/staking/hitsplats/plain_red_hitsplat.png')
		}

		context.drawImage(hitsplatImage, 0, 0, 48, 44)

		context.font = '24px "Runescape Font"'
		context.textAlign = 'center'
		context.textBaseline = 'middle'
		context.fillStyle = '#fff'

		const text = i.toString()

		context.fillText(text, 24, 22)

		const buffer = canvas.toBuffer('image/png')
		fs.writeFileSync(`./resources/images/staking/hitsplats/${i}.png`, buffer)
	}
}
const MAX_HIT = 25

class StakingClient {
	constructor(channel, player1, player2) {
		this.channel = channel
		this.player1 = player1
		this.player2 = player2
		this.player1HP = 100
		this.player2HP = 100
		this.hitter = Math.floor(Math.random() * 2) + 1 // Who hits first
		this.stake()
	}

	stake() {
		this.channel.send(`${this.hitter === 1 ? this.player1 : this.player2} has PID`)

		while (this.player1HP > 0 && this.player2HP > 0) {
			this.doTurn(this.hitter)
			this.hitter = this.hitter === 1 ? 2 : 1 // flip the hitter
		}

		this.channel.send(`${this.player1HP > 0 ? this.player1 : this.player2} wins!`)
		this.channel.send(`Final HP   -   ${this.player1}: ${this.player1HP}   ${this.player2}: ${this.player2HP}`)
	}

	doTurn(hitter) {
		if (this.hitter === 1) {
			this.player2HP -= this.getHit()
			this.player2HP = Math.max(0, this.player2HP)
		} else {
			this.player1HP -= this.getHit()
			this.player1HP = Math.max(0, this.player1HP)
		}
	}

	getHit() {
		return Math.floor(Math.random() * MAX_HIT)
	}
}

module.exports = StakingClient
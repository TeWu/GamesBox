import BlackHoleGameChannel from './channel'
import { BOARD_SIZE, CIRCLES_IN_RACK, CIRCLE_RADIUS, PLAYER_COLORS, PHASE } from './config'
import Rack from './game/rack'
import Board from './game/board'
const { waiting_for_players, local_move, remote_move, waiting_for_move_confirmation, waiting_for_scores } = PHASE


class BlackHoleGame {

  constructor(component) {
    this.component = component
    this.channel = new BlackHoleGameChannel(component, this).subscribe()
    this.sketch = this.sketch.bind(this, this)

    this.players = [null, null]
    this.isPlayerLocal = [null, null]
    this.racks = [new Rack({ num: 0 }), new Rack({ num: 1 })]
    this.board = new Board
    this.phase = PHASE.initializing
  }

  finalize() {
    this.channel.unsubscribe()
    this.channel = null
  }

  initialize(redisBoard, turnNum, currentPlayerNum, blackHoleAddr, scores, winningPlayerName) {
    this.turnNum = turnNum
    this.currentPlayerNum = currentPlayerNum
    const rackBase = Math.floor(turnNum / 2) + 1
    this.racks[currentPlayerNum].fill(rackBase)
    this.racks[1 - currentPlayerNum].fill(rackBase + (turnNum % 2))
    this.board.setFromRedis(redisBoard)
    if (blackHoleAddr) this.endGame(blackHoleAddr, scores, winningPlayerName)
    else this.startNewTurn()
  }

  get currentPlayer() { return this.players[this.currentPlayerNum] }
  isCurrentPlayerLocal() { return this.isPlayerLocal[this.currentPlayerNum] }
  get currentRack() { return this.racks[this.currentPlayerNum] }

  // TODO: rewiew correctness of 'onPlayersChange' on finished game - also make sure that leaving and rejoining the game works corectly
  onPlayersChange() {
    if (this.phase != PHASE.initializing) {
      if (this.players.some(p => p == null)) {
        if (this.phase == remote_move) this.waitForPlayers()
      } else if (this.phase == waiting_for_players) {
        this.startNewTurn()
      }
    }
    this.component.setState({ players: this.players })
  }

  waitForPlayers() {
    this.currentRack.head.stopFx()
    this.phase = waiting_for_players
  }

  onRemoteMove(i, j) {
    this.showMove(this.board.get(i, j))
    this.endTurn()
  }

  onConfirmMove() {
    this.endTurn()
  }

  onRejectMove() {
    this.lastMove.revert()
    this.lastMove = null
    this.phase = local_move
  }

  makeMove(boardCircle) {
    this.showMove(boardCircle)
    this.channel.sendMove(boardCircle.i, boardCircle.j)
    this.phase = waiting_for_move_confirmation
  }

  showMove(boardCircle) {
    const removedCircle = this.currentRack.shift()
    boardCircle.transformInto(removedCircle)
    this.lastMove = {
      i: boardCircle.i,
      j: boardCircle.j,
      is: (i, j) => i == boardCircle.i && j == boardCircle.j,
      revert: () => {
        this.currentRack.unshift(removedCircle)
        boardCircle.empty()
      }
    }
  }

  startNewTurn() {
    if (this.currentPlayer == null) this.waitForPlayers()
    else {
      this.phase = this.isCurrentPlayerLocal() ? local_move : remote_move
      this.currentRack.head.blink()
    }
  }

  endTurn() {
    this.turnNum++
    this.currentPlayerNum = this.currentPlayerNum == 0 ? 1 : 0
    if (this.currentRack.nonEmpty()) this.startNewTurn()
    else this.waitForScores()
  }

  waitForScores() {
    this.phase = waiting_for_scores
  }

  endGame(blackHoleAddr, scores, winningPlayerName) {
    const blackHole = this.board.get(blackHoleAddr.i, blackHoleAddr.j).transformIntoBlackHole()
    this.scores = scores
    this.winningPlayerName = winningPlayerName
    this.board.findNeighbours(blackHole)
      .forEach(circle => circle.blink())
    this.phase = PHASE.ended
  }

  sketch(game, _, p) {

    p.setup = function () {
      p.colorMode(p.HSB, 255)
      p.frameRate(30)
      const boardSizeBase = CIRCLE_RADIUS * BOARD_SIZE + 1
      const canvas = p.createCanvas(3 * boardSizeBase, 2 * boardSizeBase)
      canvas.mouseClicked(mouseClicked)
    }

    p.draw = function () {
      p.background(210)
      game.racks[0].draw(p)
      game.racks[1].draw(p)
      game.board.draw(p)

      if (game.phase == waiting_for_players) {
        p.textSize(27)
        p.text("Waiting for second player...", p.width / 2 - 155, p.height - 15)
      }
      else if (game.phase == PHASE.ended) {
        p.textSize(36)
        const resultText = game.winningPlayerName ? game.winningPlayerName + " wins!" : "Game drawn!"
        const fullText = resultText + "  " + game.scores.join('/')
        const fullTextWidth = p.drawingContext.measureText(fullText).width
        p.text(fullText, p.width / 2 - fullTextWidth / 2, p.height - 10)
      }

      p.textSize(27)
      p.text(`current player num: ${game.currentPlayerNum}`, 420, 30)
      p.text(`phase: ${game.phase}`, 540, 55)
      p.textSize(17)
      p.text(`turn: ${game.turnNum}`, 580, 75)
    }

    const mouseClicked = function () {
      if (game.phase == local_move) {
        const circle = game.board.findCircleUnderTheMouse(p)
        if (circle && circle.isEmpty())
          game.makeMove(circle)
      }
      return false
    }

  }

}

export default BlackHoleGame
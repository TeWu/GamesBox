import React, { Component } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import P5 from 'utils/p5_component'
import BlackHoleGame from './game'
import RematchControll from './components/rematch_controll'
import { PHASE } from './config'
const games = window.App.games


@observer
class BlackHoleGameComponent extends Component {

  componentWillMount() {
    this.game = new BlackHoleGame(this)
  }

  componentWillUnmount() {
    this.game.finalize()
    this.game = null
  }

  render() {
    const players = this.game.players.map(p => p ? p.name : "...")
    const currPlayer = this.game.currentPlayerNum
    const gameOver = this.game.phase >= PHASE.ended

    return (
      <div>
        <h1>{this.props.gameInfo.name} game session {this.props.sessionId}</h1>
        <div class="game-board-header">
          <span class={classNames('red-player', { 'active': currPlayer == 0 && !gameOver })}>{players[0]}</span>
          <span class="players-divider" />
          <span class={classNames('blue-player', { 'active': currPlayer == 1 && !gameOver })} >{players[1]}</span>
        </div>
        <P5 sketch={this.game.sketch} />
        <RematchControll game={this.game} />
      </div>
    )
  }

}

export default BlackHoleGameComponent
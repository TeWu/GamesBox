import React, { Component } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import paramCase from 'param-case'
import P5 from 'utils/p5_component'
import BlackHoleGame from './game'
import RematchControl from './components/rematch_control'
import { PHASE } from './config'
const games = window.App.games


@observer
class BlackHoleGameComponent extends Component {

  constructor(props) {
    super(props)
    this.state = { icons: {} }
  }

  componentWillMount() {
    this.game = new BlackHoleGame(this)
  }

  componentWillUnmount() {
    this.game.finalize()
    this.game = null
  }

  render() {
    const players = this.game.players.map(p => p ? p.name : "\u2026")
    const currPlayer = this.game.currentPlayerNum
    const winner = this.game.winningPlayerName
    const gameOver = this.game.phase >= PHASE.ended
    const icons = Object.keys(this.state.icons).map(i => iconElems[i])

    return (
      <div class="black-hole-game-component">
        <h1>{this.props.gameInfo.name}</h1>
        <div class="game-board-header">
          <span class={classNames('red-player', { 'active': currPlayer == 0 && !gameOver, 'winner': winner == players[0] })}>{players[0]}</span>
          <span class="players-divider">{icons}</span>
          <span class={classNames('blue-player', { 'active': currPlayer == 1 && !gameOver, 'winner': winner == players[1] })} >{players[1]}</span>
        </div>
        <P5 sketch={this.game.sketch} />
        <RematchControl game={this.game} />
      </div>
    )
  }

}

const iconElems = ['saved', 'saveFailed']
  .reduce((a, e) => {
    a[e] = <i key={paramCase(e)} class={paramCase(e) + "-icon"} />
    return a
  }, {})

export default BlackHoleGameComponent
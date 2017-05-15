import React, { Component } from 'react'
import P5 from 'utils/p5_component'
import BlackHoleGame from './game'
const games = window.App.games


class BlackHoleGameComponent extends Component {

  constructor(props) {
    super(props)
    this.state = { players: [null, null] }
  }

  componentWillMount() {
    this.game = new BlackHoleGame(this)
  }

  componentWillUnmount() {
    this.game.finalize()
    this.game = null
  }

  render() {
    const players = this.state.players.map(p => p ? p.name : "...")
    return (
      <div>
        <h1>{this.props.gameInfo.name} game session {this.props.sessionId}</h1>
        <h2>{players[0]} vs {players[1]}</h2>
        <P5 sketch={this.game.sketch} />
      </div>
    )
  }

}

export default BlackHoleGameComponent
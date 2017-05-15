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
    const p0 = this.state.players[0] || "..."
    const p1 = this.state.players[1] || "..."
    return (
      <div>
        <h1>{this.props.gameInfo.name} game session {this.props.sessionId}</h1>
        <p>
          <strong>{p0}</strong> vs <strong>{p1}</strong>
        </p>
        <P5 sketch={this.game.sketch} />
      </div>
    )
  }

}

export default BlackHoleGameComponent
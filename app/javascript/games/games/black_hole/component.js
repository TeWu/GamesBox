import React, { Component } from 'react'
import { observer } from 'mobx-react'
import P5 from 'utils/p5_component'
import BlackHoleGame from './game'
import RematchControll from './components/rematch_controll'
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
    return (
      <div>
        <h1>{this.props.gameInfo.name} game session {this.props.sessionId}</h1>
        <div style={{
          width: '723px', backgroundColor: '#bbb', fontSize: '32px',
          padding: '5px', display: 'flex', justifyContent: 'space-between', boxSizing: 'border-box'
        }}>
          <span>{players[0]}</span>
          <span>vs</span>
          <span>{players[1]}</span>
        </div>
        <P5 sketch={this.game.sketch} />
        <RematchControll game={this.game} />
      </div>
    )
  }

}

export default BlackHoleGameComponent
import React, { Component } from 'react'
import GameSessionChannel from 'cable/game_session_channel'
const games = window.App.games

class GameSessionPage extends Component {

  constructor(props) {
    super(props)
    this.game = games[props.match.params.game]
    this.sessionId = props.match.params.sessionId
  }

  componentWillMount() {
    this.gameSessionChannel = GameSessionChannel.create(this.game.urlSegment, this.sessionId)
  }

  componentWillUnmount() {
    this.gameSessionChannel.prepareToUnsubscribe()
    this.gameSessionChannel.unsubscribe()
  }

  render() {
    return <div>
      <h1>{this.game.name} game session {this.sessionId}</h1>
    </div>
  }

}

export default GameSessionPage
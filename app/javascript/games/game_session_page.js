import React, { Component } from 'react'
import BlackHoleGameComponent from './games/black_hole/component'
const games = window.App.games


const GAME_COMPONENTS = {
  'black-hole': BlackHoleGameComponent
}

class GameSessionPage extends Component {

  constructor(props) {
    super(props)
    this.gameInfo = games[props.match.params.game]
    this.sessionId = props.match.params.sessionId
    this.gameComponent = React.createElement(
      GAME_COMPONENTS[this.gameInfo.urlSegment],
      { gameInfo: this.gameInfo, sessionId: this.sessionId, isPublic: props.isPublic }
    )
  }

  render() {
    return this.gameComponent
  }

}

export default GameSessionPage
import React, { Component } from 'react'
import GamesList from './components/games_list'
const games = window.App.games

class IndexPage extends Component {

  render() {
    return <div>
      <h1>List of games</h1>
      <GamesList games={Object.values(games)} />
    </div>
  }

}

export default IndexPage
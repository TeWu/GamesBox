import React, { Component } from 'react'
import GamesList from './components/games_list'
const games = window.App.games

class IndexPage extends Component {

  componentWillMount() {
    this.props.gameSessionsStore.fetchAll()
  }

  render() {
    return <GamesList games={Object.values(games)} store={this.props.gameSessionsStore} />
  }

}

export default IndexPage
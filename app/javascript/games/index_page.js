import React, { Component } from 'react'
import GamesList from './components/games_list'
const games = window.App.games

class IndexPage extends Component {

  componentWillMount() {
    this.props.gameSessionsStore.fetchAll()
  }

  render() {
    return <div class="page">
      <GamesList games={Object.values(games)} store={this.props.gameSessionsStore} history={this.props.history} />
    </div>
  }

}

export default IndexPage
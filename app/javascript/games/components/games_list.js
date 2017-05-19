import React, { Component } from 'react'
import SessionsList from './sessions_list'
import CreateGameSessionForm from './create_form'

class GamesList extends Component {
  render() {
    const gamesElems = this.props.games.map(game =>
      <section key={game.urlSegment}>
        <h2>{game.name}</h2>
        <div class="game-sessions-list-container">
          <SessionsList game={game} store={this.props.store} />
        </div>
        <CreateGameSessionForm game={game} history={this.props.history} />
      </section>
    )
    return <div>{gamesElems}</div>
  }
}

export default GamesList
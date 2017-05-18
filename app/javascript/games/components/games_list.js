import React, { Component } from 'react'
import SessionsList from './sessions_list'
import { game_session_path } from 'config/reverse_routes'

class GamesList extends Component {
  render() {
    const gamesElems = this.props.games.map(game =>
      <section key={game.urlSegment}>
        <h2>{game.name}</h2>
        <SessionsList game={game} store={this.props.store} />
      </section>
    )
    return <div>{gamesElems}</div>
  }
}

export default GamesList
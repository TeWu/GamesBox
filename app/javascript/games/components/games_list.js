import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { game_session_path } from 'config/reverse_routes'

class GamesList extends Component {

  render() {
    const gamesElems = this.props.games.map(game =>
      <section key={game.urlSegment}>
        <h2>{game.name} ({game.urlSegment})</h2>
        <ul>
          <li><Link to={game_session_path(game, 'jG49Df7')}>jG49Df7</Link></li>
          <li><Link to={game_session_path(game, 'nJs634F')}>nJs634F</Link></li>
          <li><Link to={game_session_path(game, '348y922')}>348y922</Link></li>
        </ul>
      </section>
    )

    return (
      <div>
        {gamesElems}
      </div>
    )
  }
}

export default GamesList
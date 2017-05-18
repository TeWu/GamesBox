import React, { Component } from 'react'
import { observer } from 'mobx-react'
import LinkIf from 'utils/link_if'
import { game_session_path } from 'config/reverse_routes'

@observer
class SessionsList extends Component {
  render() {
    const { game, store } = this.props
    const sessionsLis = store.all(game.urlSegment).map(s => <SessionsListItem key={s.id} game={game} {...s} />)

    if (sessionsLis.length > 0) return <ul>{sessionsLis}</ul>
    else return <div>No open game sessions</div>
  }
}

export const SessionsListItem = (props) => {
  const { game, id } = props
  const players = props.players.map(p => p || "\u2026")
  const nonFull = props.players.some(p => p == null)

  return <li><LinkIf if={nonFull} to={game_session_path(game, id)}>{players[0]} vs {players[1]}</LinkIf></li>
}

export default SessionsList
import React, { Component } from 'react'
import { game_session_path, private_game_session_path } from 'config/reverse_routes'
import { generateRandomId } from 'utils/random'

class CreateForm extends Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    const isPrivate = e.target.elements["game-session-private"].checked
    const pathGen = isPrivate ? private_game_session_path : game_session_path
    this.props.history.push(pathGen(this.props.game, generateRandomId(7)))
  }

  render() {
    return (
      <form class="create-game-session" onSubmit={this.handleSubmit}>
        <input type="submit" value={`Create new ${this.props.game.name} game session`} />
        <input type="checkbox" id="game-session-private" /><label for="game-session-private">private</label>
      </form>
    )
  }

}

export default CreateForm
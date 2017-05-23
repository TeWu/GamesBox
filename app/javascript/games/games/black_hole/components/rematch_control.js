import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { PHASE } from '../config'
const { rematch_requested } = PHASE


@observer
class RematchControl extends Component {

  constructor(props) {
    super(props)
    this.game = props.game
    this.requestRematch = this.game.requestRematch.bind(this.game)
  }

  render() {
    const buttonText = this.game.phase == rematch_requested ? "Rematch requested" : "Play again"
    const isButtonVisible = this.game.phase >= PHASE.ended
    const isButtonDisabled = this.game.phase != PHASE.ended

    const rematchRequestElems = this.game.rematchRequestingPlayers.map(playerNum => {
      const playerName = this.game.players[playerNum].name
      return <div key={playerNum} class="rematch-request">{playerName} wants a rematch!</div>
    })

    return (
      <div class="rematch-control">
        <div>{rematchRequestElems}</div>
        <button type="button" disabled={isButtonDisabled}
          class="rematch-button" style={{ visibility: (isButtonVisible ? "visible" : "hidden") }}
          onClick={this.requestRematch}>{buttonText}</button>
      </div>
    )
  }

}

export default RematchControl
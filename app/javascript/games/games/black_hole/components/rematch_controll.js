import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { PHASE } from '../config'
const { rematch_requested } = PHASE


@observer
class RematchControll extends Component {

  constructor(props) {
    super(props)
    this.game = props.game
    this.requestRematch = this.game.requestRematch.bind(this.game)
  }

  render() {
    const buttonText = this.game.phase == rematch_requested ? "Rematch requested" : "Play again"
    const isButtonDisabled = this.game.phase != PHASE.ended

    const rematchRequestElems = this.game.rematchRequestingPlayers.map(playerNum => {
      const playerName = this.game.players[playerNum].name
      return <div key={playerNum}>{playerName} wants a rematch!</div>
    })

    return (
      <div>
        <button disabled={isButtonDisabled}
          style={{ width: '723px', height: '50px' }}
          type="button" onClick={this.requestRematch}>{buttonText}</button>
        <div>
          {rematchRequestElems}
        </div>
      </div>
    )
  }

}

export default RematchControll
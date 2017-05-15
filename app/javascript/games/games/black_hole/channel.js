import GameSessionChannelBase from 'cable/game_session_channel_base'
import { PHASE } from './config'
const { waiting_for_move_confirmation } = PHASE


class BlackHoleGameChannel extends GameSessionChannelBase {

  subscribe() {
    return super.subscribe('BlackHoleGameChannel', { session_id: this.component.props.sessionId })
  }


  subscribed() {
    super.subscribed()
    console.log("subscribed")
  }
  rejected(reason) { console.log("rejected", JSON.stringify(reason)) }
  unsubscribed() { console.log("unsubscribed") }
  disconnected() { console.log("disconnected") }

  received(data) {

    console.log("received", JSON.stringify(data))

    const [type, payload] = super.received(data)


    switch (type) {
      case 'current_state':
        if (this.game.phase == PHASE.initializing) {
          const startingPlayer = payload.starting_player
          const turnNum = payload.turn_num || 0
          const currentPlayerNum = turnNum % 2 == 0 ? startingPlayer : (1 - startingPlayer)
          this.game.initialize(payload.board, turnNum, currentPlayerNum)
        }
        break
      case 'move':
        const i = payload.i, j = payload.j
        if (this.game.phase == waiting_for_move_confirmation) {
          if (this.game.lastMove.is(i, j))
            this.game.onConfirmMove()
          else {
            this.game.onRejectMove()
            this.game.onRemoteMove(i, j)
          }
        }
        else if (this.game.phase != PHASE.initializing) this.game.onRemoteMove(i, j)
        break
      case 'move_rejected':
        if (this.game.phase == waiting_for_move_confirmation && payload == this.game.turnNum)
          this.game.onRejectMove()
        break
    }
  }

  sendMove(i, j) {
    const turn_num = this.game.turnNum
    this.send('move', { turn_num, i, j })
  }

}

export default BlackHoleGameChannel
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
          const currentPlayerNum = payload.current_player
          const turnNum = payload.turn_num || 0
          this.game.initialize(payload.board, turnNum, currentPlayerNum, payload.black_hole, payload.scores, payload.winner_name, payload.rematch)
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
        if (this.game.phase == waiting_for_move_confirmation && payload.turn_num == this.game.turnNum) {
          console.error("Move rejected by the server: " + payload.reason)
          this.game.onRejectMove()
        }
        break
      case 'end_game':
        if (this.game.phase != PHASE.initializing)
          this.game.endGame(payload.black_hole, payload.scores, payload.winner_name)
        break
      case 'rematch_pending':
        if (this.game.phase == PHASE.ended)
          this.game.onRematchPending(payload)
        break
      case 'reset':
        if (this.game.phase >= PHASE.ended)
          this.game.onGameReset(payload)
        break
    }
  }

  sendMove(i, j) {
    const turn_num = this.game.turnNum
    this.send('move', { turn_num, i, j })
  }

  sendRematchRequest(requestingPlayersNums) {
    this.send('rematch_request', requestingPlayersNums)
  }
}

export default BlackHoleGameChannel
import GameSessionChannelBase from 'cable/game_session_channel_base'

class BlackHoleGameChannel extends GameSessionChannelBase {

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
      case 'event1':
        break
      case 'event2':
        break
    }
  }

  subscribe() {
    return super.subscribe('BlackHoleGameChannel', { session_id: this.component.props.sessionId })
  }

}

export default BlackHoleGameChannel
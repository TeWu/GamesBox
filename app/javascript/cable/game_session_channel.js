const cable = window.App.cable

const mixin = {

  /* Called when the WebSocket connection is closed */
  disconnected: function () {
    /* The unnecessary callback */
    console.log("GameSessionChannel disconnected")
  },

  /* Called when the subscription is ready for use on the server */
  /* The missnamed callback */
  connected: function () { this.subscribed() },

  subscribed: function () {
    console.log("GameSessionChannel subscribed")
    this.sendTyped('get_state')
  },

  /* Called when the subscription is rejected by the server */
  rejected: function () {
    console.log("GameSessionChannel rejected")
  },

  prepareToUnsubscribe: function () {
    console.log("GameSessionChannel unsubscribed")
  },

  received: function (data) {
    console.log("GameSessionChannel received: " + JSON.stringify(data))
    const [type, payload] = data

    switch (type) {
      case 'join_rejected':
        break
      case 'current_state':
        this.state = payload
        break
    }
  },

  sendTyped: function (type, payload = null) {
    this.send({ data: [type, payload] })
  }

}

export default {
  create: function (gameId, sessionId) {
    return cable.subscriptions.create(
      {
        channel: 'GameSessionChannel',
        game_id: gameId,
        session_id: sessionId
      }, mixin
    )
  }
}

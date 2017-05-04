
const mixin = {
  /* Called when the subscription is ready for use on the server */
  connected: function () {
    console.log("GameSessionChannel connected")
  },

  /* Called when the WebSocket connection is closed */
  disconnected: function () {
    console.log("GameSessionChannel disconnected")
  },

  /* Called when the subscription is rejected by the server */
  rejected: function () {
    console.log("GameSessionChannel rejected")
  },

  received: function (data) {
    console.log("GameSessionChannel received: " + JSON.stringify(data))
  }
}

export default {
  create: function (id) {
    return window.App.cable.subscriptions.create(
      { channel: 'GameSessionChannel', id }, mixin
    )
  }
}

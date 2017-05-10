const cable = window.App.cable

class ActionCableChannelAdapter {

  subscribed() { }
  rejected(reason) { }
  received(data) { }
  unsubscribed() { }
  disconnected() { }

  subscribe(channelName, params = {}) {
    if (this.cableChannel) this.cableChannel.finalize()
    this.cableChannel = cable.subscriptions.create(
      Object.assign({ channel: channelName }, params),
      createProxyMixin(this)
    )
    return this
  }
  unsubscribe() { this.cableChannel.finalize() }
  isSubscribed() { return this.cableChannel.isSubscribed() }
  perform(action, data = {}) { this.cableChannel.perform(action, data) }
  send(data) { this.cableChannel.send(data) }

}

function createProxyMixin(channel) {
  let isSubscribed = false
  return {
    target: channel,
    isSubscribed: function () { return isSubscribed },
    disconnected: function () {
      if (isSubscribed) {
        isSubscribed = false
        this.target.unsubscribed()
      }
      this.target.disconnected()
    },
    connected: function () {
      if (!isSubscribed) {
        isSubscribed = true
        this.target.subscribed()
      }
    },
    rejected: function () { },
    received: function (data) {
      if (data.constructor === Array) {
        if (data[0] == '_AC:GBBC_rejected') {
          this.target.rejected(data[1])
          return
        }
      }
      this.target.received(data)
    },
    finalize: function () {
      if (this.consumer.subscriptions.findAll(this.identifier).length > 0)
        this.unsubscribe()
      if (isSubscribed) {
        isSubscribed = false
        this.target.unsubscribed()
      }
      this.target = emptyChannel
    },
  }
}

const emptyChannel = {
  subscribed: function () { },
  rejected: function (reason) { },
  unsubscribed: function () { },
  received: function (data) { }
}

export default ActionCableChannelAdapter
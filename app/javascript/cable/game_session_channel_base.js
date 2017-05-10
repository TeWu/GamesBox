import ActionCableChannelAdapter from 'cable/action_cable_channel_adapter'

class GameSessionChannelBase extends ActionCableChannelAdapter {

  constructor(component, game) {
    super()
    this.component = component
    this.game = game
    this.isStateInitialized = false
  }

  subscribed() { this.send('get_state') }

  received(data) {
    const [type, payload] = data

    switch (type) {
      case 'current_state':
        if (!this.isStateInitialized) {
          this.isStateInitialized = true
          this.component.setState({ players: payload.players })
          break
        }
      case 'player_joined': {
        const players = this.component.state.players
        players[parseInt(payload.num)] = payload.name
        this.component.setState({ players: players })
      }
        break
      case 'player_left': {
        const players = this.component.state.players
        players[parseInt(payload)] = null
        this.component.setState({ players: players })
        break
      }
    }

    return [type, payload]
  }

  send(type, payload = null) {
    if (payload === null) super.send({ data: [type] })
    else super.send({ data: [type, payload] })
  }

}

export default GameSessionChannelBase
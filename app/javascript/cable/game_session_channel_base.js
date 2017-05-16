import ActionCableChannelAdapter from 'cable/action_cable_channel_adapter'
const currentUser = window.App.currentUser


const isStateInitialized = Symbol()

class GameSessionChannelBase extends ActionCableChannelAdapter {

  constructor(component, game) {
    super()
    this.component = component
    this.game = game
  }

  subscribed() { this.send('get_state') }

  received(data) {
    const [type, payload] = data

    switch (type) {
      case 'current_state': {
        if (!this[isStateInitialized]) {
          this[isStateInitialized] = true
          for (let i = 0; i < payload.players.length; i++)
            if (payload.players[i]) {
              this.game.players[i] = { name: payload.players[i] }
              this.game.isPlayerLocal[i] = payload.players[i] == currentUser.displayName
            }
          this.game.onPlayersChange('set', null)
        }
        break
      }
      case 'player_joined': {
        const idx = parseInt(payload.num)
        this.game.players[idx] = { name: payload.name }
        this.game.isPlayerLocal[idx] = payload.name == currentUser.displayName
        this.game.onPlayersChange('player_joined', idx)
        break
      }
      case 'player_left': {
        const idx = parseInt(payload)
        this.game.onPlayersChange('player_left', idx)
        this.game.players[idx] = null
        this.game.isPlayerLocal[idx] = null
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
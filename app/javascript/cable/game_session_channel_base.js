import ActionCableChannelAdapter from 'cable/action_cable_channel_adapter'
const currentUser = window.App.currentUser


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
      case 'current_state': {
        if (!this.isStateInitialized) {
          for (let i = 0; i < payload.players.length; i++)
            if (payload.players[i]) {
              this.game.players[i] = { name: payload.players[i] }
              this.game.isPlayerLocal[i] = payload.players[i] == currentUser.displayName
            }
          this.initializeState(payload)
          this.isStateInitialized = true
        }
        break
      }
      case 'player_joined':
        if (this.isStateInitialized) {
          const playerNum = parseInt(payload.num)
          const player = { name: payload.name }
          this.game.aroundPlayersChange('player_joined', playerNum, player, () => {
            this.game.players[playerNum] = player
            this.game.isPlayerLocal[playerNum] = player.name == currentUser.displayName
          })
          break
        }
      case 'player_left':
        if (this.isStateInitialized) {
          const playerNum = parseInt(payload)
          const player = this.game.players[playerNum]
          this.game.aroundPlayersChange('player_left', playerNum, player, () => {
            this.game.players[playerNum] = null
            this.game.isPlayerLocal[playerNum] = null
          })
          break
        }
    }

    return [type, payload]
  }

  initializeState(state) { }

  send(type, payload = null) {
    if (payload === null) super.send({ data: [type] })
    else super.send({ data: [type, payload] })
  }

}

export default GameSessionChannelBase
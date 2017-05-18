import { observable } from 'mobx'
import axios from 'axios'

class GameSessionsStore {
  sessions = observable.map()

  all(gameId) {
    return this.sessions.get(gameId) || []
  }

  fetchAll() {
    return axios.get('/api/game_sessions.json')
      .then(resp => this.sessions.replace(observable.map(resp.data)))
  }

}

export default new GameSessionsStore
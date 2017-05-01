import { observable, computed } from 'mobx'
import axios from 'axios'
import User from './user'

class UsersListStore {
  users = observable.map()

  @computed get all() {
    return this.users.values()
  }

  constructor() {
    const csrfToken = document.head.querySelector("[name=csrf-token]").content
    this.csrfTokenHeader = { headers: { 'X-CSRF-Token': csrfToken } }
    this.fetchAll().then(users => this.users.replace(observable.map(users)) )
  }

  fetchAll() {
    return axios.get('/api/users.json')
      .then(resp =>
        resp.data.reduce((map, data) => {
          map[data.id] = new User(data)
          return map
        }, {})
      )
      .catch(error => console.error(error))
  }

}

//TODO: Show error message on page instead of `console.error(...)`

export default new UsersListStore
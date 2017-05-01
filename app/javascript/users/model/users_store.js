import { observable, computed } from 'mobx'
import axios from 'axios'
import User from './user'

class UsersStore {
  users = observable.map()

  constructor() {
    const csrfToken = document.head.querySelector("[name=csrf-token]").content
    this.csrfTokenHeader = { headers: { 'X-CSRF-Token': csrfToken } }
  }

  @computed get all() {
    return this.users.values()
  }

  get(urlSegment) {
    return this.users.get(urlSegment)
  }

  fetchAll() {
    axios.get('/api/users.json')
      .then(resp =>
        resp.data.reduce((map, data) => {
          map[data.url_segment] = new User(data)
          return map
        }, {})
      )
      .then(users =>
        this.users.replace(observable.map(users))
      )
      .catch(error => console.error(error))
  }

  fetch(urlSegment) {
    axios.get(`/api/users/${urlSegment}.json`)
      .then(resp =>
        this.users.set(resp.data.url_segment, new User(resp.data))
      )
      .catch(error => console.error(error))
  }

}

//TODO: Show error message on page instead of `console.error(...)`

export default new UsersStore
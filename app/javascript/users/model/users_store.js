import { observable, computed } from 'mobx'
import axios from 'axios'
import User from './user'


class UsersStore {
  users = observable.map()

  constructor() {
    const csrfToken = document.head.querySelector("[name=csrf-token]").content
    this.axios = axios.create({ headers: { 'X-CSRF-Token': csrfToken } })
  }

  @computed get all() {
    return this.users.values()
  }

  get(urlSegment) {
    return this.users.get(urlSegment)
  }

  fetchAll() {
    return this.axios.get('/api/users.json')
      .then(resp => {
        const users = resp.data.reduce((map, data) => {
          map[data.url_segment] = new User(data)
          return map
        }, {})
        this.users.replace(observable.map(users))
      })
  }

  fetch(urlSegment) {
    return this.axios.get(`/api/users/${urlSegment}.json`)
      .then(resp => {
        const user = new User(resp.data)
        this.users.set(user.urlSegment, user)
        return user
      })
  }

  update(urlSegment, userData) {
    return this.axios.patch(`/api/users/${urlSegment}.json`, { user: userData })
      .then(resp => {
        const user = new User(resp.data)
        this.users.delete(urlSegment)
        this.users.set(user.urlSegment, user)
        return user
      })
  }

  delete(urlSegment) {
    return this.axios.delete(`/api/users/${urlSegment}.json`)
      .then(resp => this.users.delete(urlSegment))
  }

}

export default new UsersStore
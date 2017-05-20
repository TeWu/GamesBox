import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { users_path, games_path, logout_path } from 'config/reverse_routes'
const currentUser = window.App.currentUser


class NavBar extends Component {

  constructor(props) {
    super(props)
    const csrfToken = document.head.querySelector("[name=csrf-token]").content
    this.axios = axios.create({ headers: { 'X-CSRF-Token': csrfToken } })
    this.logout = this.logout.bind(this)
  }

  logout(e) {
    e.preventDefault()
    this.axios.delete(logout_path, { maxRedirects: 0 })
      .then(() => window.location.pathname = '')
  }

  render() {
    return (
      <nav class="top-navbar">
        <span class="user-name">{currentUser.displayName}</span>
        (<a href={logout_path} onClick={this.logout}>Logout</a>)
        <span class="pages">
          <Link class="users" to={users_path}>Users</Link>
          <Link class="games" to={games_path}>Games</Link>
        </span>
      </nav>
    )
  }
}

export default NavBar
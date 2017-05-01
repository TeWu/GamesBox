import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import UsersIndexPage from 'users/index_page'
import ShowUserPage from 'users/show_page'

import usersStore from 'users/model/users_store'


class MainApp extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/users" component={p => <UsersIndexPage usersStore={usersStore} {...p} />} />
          <Route exact path="/users/:user" component={p => <ShowUserPage usersStore={usersStore} {...p} />} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default MainApp
import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import * as RR from '../config/reverse_routes'

import UsersIndexPage from 'users/index_page'
import ShowUserPage from 'users/show_page'
import EditUserPage from 'users/edit_page'

import usersStore from 'users/model/users_store'


class MainApp extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={RR.users_path} component={p => <UsersIndexPage usersStore={usersStore} {...p} />} />
          <Route exact path={RR.user_path({ urlSegment: ':user' })} component={p => <ShowUserPage usersStore={usersStore} {...p} />} />
          <Route exact path={RR.edit_user_path({ urlSegment: ':user' })} component={p => <EditUserPage usersStore={usersStore} {...p} />} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default MainApp
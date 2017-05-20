import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import * as RR from 'config/reverse_routes'

import NavBar from './navbar'
import UsersIndexPage from 'users/index_page'
import ShowUserPage from 'users/show_page'
import EditUserPage from 'users/edit_page'
import usersStore from 'users/model/users_store'
import gameSessionsStore from 'games/model/game_sessions_store'

import GamesIndexPage from 'games/index_page'
import GameSessionPage from 'games/game_session_page'


class MainApp extends Component {
  render() {
    return (
      <BrowserRouter>
        <section>
          <NavBar />
          <main>
            <Switch>
              <Route exact path={RR.users_path} component={p => <UsersIndexPage usersStore={usersStore} {...p} />} />
              <Route exact path={RR.user_path({ urlSegment: ':user' })} component={p => <ShowUserPage usersStore={usersStore} {...p} />} />
              <Route exact path={RR.edit_user_path({ urlSegment: ':user' })} component={p => <EditUserPage usersStore={usersStore} {...p} />} />

              <Route exact path={RR.games_path} component={p => <GamesIndexPage gameSessionsStore={gameSessionsStore} {...p} />} />
              <Route exact path={RR.game_path({ urlSegment: ':game' })} render={() => <Redirect to={RR.games_path} />} />
              <Route exact path={RR.game_session_path({ urlSegment: ':game' }, ':sessionId')} component={p => <GameSessionPage isPublic={true} {...p} />} />} />
              <Route exact path={RR.private_game_session_path({ urlSegment: ':game' }, ':sessionId')} component={p => <GameSessionPage isPublic={false} {...p} />} />} />
            </Switch>
          </main>
        </section>
      </BrowserRouter>
    )
  }
}

export default MainApp
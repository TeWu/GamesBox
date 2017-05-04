import React, { Component } from 'react'
import UsersList from './components/users_list'
import GameSessionChannel from 'cable/game_session_channel'

class IndexPage extends Component {

  componentWillMount() {
    this.props.usersStore.fetchAll()
    this.gameSessionChannel = GameSessionChannel.create('ala1234')
  }

  componentWillUnmount() {
    this.gameSessionChannel.unsubscribe()
  }

  render() {
    return <UsersList store={this.props.usersStore} />
  }

}

export default IndexPage
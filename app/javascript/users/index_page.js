import React, { Component } from 'react'
import usersListStore from './model/users_list_store'
import UsersList from './components/users_list'

class IndexPage extends Component {
  render() {
    return (
      <UsersList store={usersListStore}/>
    )
  }
}

export default IndexPage
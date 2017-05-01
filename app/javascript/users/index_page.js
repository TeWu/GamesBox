import React, { Component } from 'react'
import UsersList from './components/users_list'

class IndexPage extends Component {

  componentWillMount() {
    this.props.usersStore.fetchAll()
  }

  render() {
    return <UsersList store={this.props.usersStore} />
  }

}

export default IndexPage
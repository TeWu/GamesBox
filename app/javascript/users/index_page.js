import React, { Component } from 'react'
import UsersList from './components/users_list'

class IndexPage extends Component {

  componentWillMount() {
    this.props.usersStore.fetchAll()
  }

  render() {
    return <div class="page">
      <UsersList store={this.props.usersStore} />
    </div>
  }

}

export default IndexPage
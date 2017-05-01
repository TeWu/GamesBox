import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'

@observer
class UsersList extends Component {
  render() {
    const users = this.props.store.all.map(user =>
      <tr key={user.id}>
        <td>{user.displayName}</td>
        <td>{user.email}</td>
        <td>{user.username}</td>
        <td>{user.roles.join(', ')}</td>
        <td>{user.isAdmin}</td>
        <td>{user.inviteKey}</td>
        <td>{user.invitedBy}</td>
        <td>Show</td>
        <td>Edit</td>
        <td>Destroy</td>
      </tr>
    )

    return (
      <div>
        <h1>List of users</h1>
        <table>
          <thead>
            <tr>
              <th>Display name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Roles</th>
              <th>Is admin?</th>
              <th>Invite key</th>
              <th>Invited by</th>
              <th colSpan={3}></th>
            </tr>
          </thead>
          <tbody>
            {users}
          </tbody>
        </table>
      </div>
    )
  }
}

export default UsersList


import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { user_path, edit_user_path } from 'config/reverse_routes'


@observer
class UsersList extends Component {

  deleteUser(user) {
    if (confirm(`Do you want to DELETE user ${user.displayName} ?`))
      this.props.store.delete(user.urlSegment)
  }

  render() {
    const usersRows = this.props.store.all.map(user =>
      <tr key={user.id}>
        <td><Link to={user_path(user)}>{user.displayName}</Link></td>
        <td>{user.email}</td>
        <td>{user.username}</td>
        <td>{user.roles.join(', ')}</td>
        <td>{user.isAdmin}</td>
        <td>{user.inviteKey}</td>
        <td>{user.invitedBy}</td>
        <td><Link to={edit_user_path(user)}>Edit</Link></td>
        <td><button onClick={this.deleteUser.bind(this, user)}>Destroy</button></td>
      </tr>
    )

    return (
      <div>
        <h1>List of users ({usersRows.length})</h1>
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
              <th colSpan={2}></th>
            </tr>
          </thead>
          <tbody>
            {usersRows}
          </tbody>
        </table>
        {usersRows.length == 0 ? <div>Loading...</div> : undefined}
      </div>
    )
  }
}

export default UsersList
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { users_path } from 'config/reverse_routes'


@observer
class ShowPage extends Component {

  constructor(props) {
    super(props)
    this.userUrlSegment = props.match.params.user
  }

  componentWillMount() {
    this.props.usersStore.fetch(this.userUrlSegment)
  }

  render() {
    const user = this.props.usersStore.get(this.userUrlSegment)
    if (!user) return <div>Loading...</div>
    const { username, displayName } = user

    return (
      <div>
        <h1>{displayName}</h1>
        <div><strong>username:</strong> {username}</div>
        <div><strong>created at:</strong> {user.createdAt}</div>
        <div><strong>updated at:</strong> {user.updatedAt}</div>
        <div>
          <Link to={users_path}>Go to list of users</Link>
        </div>
      </div>
    )
  }

}

export default ShowPage
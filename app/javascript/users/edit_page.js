import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'

import EditForm from './components/edit_form'
import { users_path } from 'config/reverse_routes'


@observer
class EditPage extends Component {

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

    return (
      <div>
        <h1>{user.displayName}</h1>
        <EditForm store={this.props.usersStore} user={user} />
        <hr />
        <div>
          <Link to={users_path}>Go to list of users</Link>
        </div>
      </div>
    )
  }

}

export default EditPage
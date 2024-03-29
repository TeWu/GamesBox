import React, { Component } from 'react'
import { observer } from 'mobx-react'
import serialize from 'form-serialize'
import User from 'users/model/user'
import { ensureArray } from 'utils/utils'
import { TextField, PasswordField, CheckboxField } from 'utils/form_fields'


@observer
class EditForm extends Component {

  constructor(props) {
    super(props)
    this.state = { errors: {} }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    const data = serialize(e.target, { hash: true })
    ensureArray(data, 'roles')
    this.props.store.update(this.props.user.urlSegment, data)
      .then(user => alert("User updated successfully"))
      .catch(error => this.setState({ errors: error.response.data }))
  }

  render() {
    const { user } = this.props
    if (!user) return <div>Loading...</div>

    const { errors } = this.state
    return (
      <form onSubmit={this.handleSubmit} >
        <section class="form-fields">
          <TextField label="Username" name="username" defaultValue={user.username} errors={errors.username} />
          <PasswordField label="Password" name="password" errors={errors.password} />
          <PasswordField label="Password confirmation" name="password_confirmation" errors={errors.password_confirmation} />
          <TextField label="Display name" name="display_name" defaultValue={user.displayName} errors={errors.display_name} />
          <TextField label="Email" name="email" defaultValue={user.email} errors={errors.email} />
          <TextField label="Invite key" name="invite_key" defaultValue={user.inviteKey} errors={errors.invite_key} />
          <CheckboxField name="roles" values={['active', 'admin']} object={user} errors={errors.roles} />
        </section>
        <section class="form-actions">
          <input type="submit" value="Submit" />
        </section>
      </form>
    )
  }

}

export default EditForm
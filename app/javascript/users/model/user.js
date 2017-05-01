import { observable } from 'mobx'

class User {
  @observable username
  @observable roles
  @observable isAdmin
  @observable displayName
  @observable email
  @observable inviteKey
  @observable invitedBy
  @observable createdAt
  @observable updatedAt

  constructor({ id, url_segment, username, roles, is_admin, display_name, email, invite_key, invited_by, created_at, updated_at }) {
    this.id = id
    this.urlSegment = url_segment
    this.username = username
    this.roles = roles
    this.isAdmin = is_admin
    this.displayName = display_name
    this.email = email
    this.inviteKey = invite_key
    this.invitedBy = invited_by
    this.createdAt = created_at
    this.updatedAt = updated_at
  }
}

export default User
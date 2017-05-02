export const users_path = '/users'
export const user_path = (user) => '/users/' + user.urlSegment
export const edit_user_path = (user) => `/users/${user.urlSegment}/edit`
export const users_path = '/users'
export const user_path = (user) => '/users/' + user.urlSegment
export const edit_user_path = (user) => `/users/${user.urlSegment}/edit`

export const games_path = '/games'
export const game_path = (game) => '/games/' + game.urlSegment
export const game_session_path = (game, sessionId) => `/games/${game.urlSegment}/${sessionId}`
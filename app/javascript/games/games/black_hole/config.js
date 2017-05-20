export const BOARD_SIZE = window.App.games['black-hole'].config.boardSize
export const CIRCLES_IN_RACK = window.App.games['black-hole'].config.circlesInRack
export const CIRCLE_RADIUS = 40
export const EMPTY_CIRCLE_COLOR = "#363636"
export const BLACK_HOLE_CIRCLE_COLOR = "#000"
export const PLAYER_COLORS = ["#F88", "#99F"]

export const PHASE = {
  initializing: 0,
  waiting_for_players: 1,
  local_move: 2,
  remote_move: 3,
  waiting_for_move_confirmation: 4,
  waiting_for_scores: 5,
  ended: 6,
  rematch_requested: 7
}

export const TEXTS = {
  waiting_for_players: 0,
  winner_and_scores: 1
}
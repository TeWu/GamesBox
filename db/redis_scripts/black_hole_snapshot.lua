-- black_hole_snapshot [game_session_key_prefix]
local players_user_ids = redis.call('HGETALL', KEYS[1] .. ":players:user-ids")
local scores = redis.call('LRANGE', KEYS[1] .. ":scores", 0, 1)
local moves = redis.call('LRANGE', KEYS[1] .. ":moves", 0, 19)
local starting_player = redis.call('HGET', KEYS[1], "current_player")

return {players_user_ids, scores, moves, starting_player}
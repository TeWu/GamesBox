-- black_hole_move [game_session_key_prefix] [turn, board_circle_key, player_name]

-- 1) Authorize move
local current_player_num = redis.call('HGET', KEYS[1], "current_player")
local current_player_name = redis.call('HGET', KEYS[1] .. ":players", current_player_num)
if current_player_name ~= ARGV[3] then return "out_of_turn" end

local circle = redis.call('HGET', KEYS[1] .. ":board", ARGV[2])
if circle then return "invalid_move" end

local turn_num = redis.call('HGET', KEYS[1], "turn_num") or "0"
if turn_num ~= ARGV[1] then return "turn_num_mismatch" end

-- 2) Record move
redis.call('HINCRBY', KEYS[1], 'turn_num', 1)
redis.call('HSET', KEYS[1], 'current_player', 1 - current_player_num)
circle = math.floor(turn_num / 2) + 1 .. "," .. current_player_num
redis.call('HSET', KEYS[1] .. ":board", ARGV[2], circle)
redis.call('RPUSH', KEYS[1] .. ":moves", ARGV[2])

return "ok"
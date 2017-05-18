-- leave_game_session [players_hash, user_ids_hash, subscriptions_hash] [player_name, user_id]
local incr_res = redis.call('HINCRBY', KEYS[3], ARGV[2], -1)
if incr_res == 0 then
  redis.call('HDEL', KEYS[3], ARGV[2])

  local player_num = nil
  local get_res = redis.call('HGETALL', KEYS[1])
  local get_res_len = table.getn(get_res)
  local i = 2
  while i <= get_res_len do
    if get_res[i] == ARGV[1] then
      player_num = get_res[i-1]
      break
    end
    i = i + 2
  end

  if player_num == nil then
    return {"already_left", get_res_len == 0}
  else
    redis.call('HDEL', KEYS[2], player_num)
    redis.call('HDEL', KEYS[1], player_num)
    return {"left", get_res_len == 2, player_num}
  end

else
  return {"not_last_subscription", false, incr_res}
end
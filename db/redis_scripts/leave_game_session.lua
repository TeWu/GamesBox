-- leave_game_session [players_hash, subscriptions_hash, subscription_id] [player_name]
local incr_res = redis.call('HINCRBY', KEYS[2], KEYS[3], -1)
if incr_res == 0 then
  redis.call('HDEL', KEYS[2], KEYS[3])

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
    return {"already_left"}
  else
    redis.call('HDEL', KEYS[1], player_num)
    return {"left", player_num}
  end

else
  return {"not_last_subscription", incr_res}
end
-- leave_game_session [players_hash, player_num, subscriptions_hash, subscription_id] [player_name]
local incr_res = redis.call('HINCRBY', KEYS[3], KEYS[4], -1)
if incr_res == 0 then
  redis.call('HDEL', KEYS[3], KEYS[4])

  local get_res = redis.call('HGET', KEYS[1], KEYS[2])
  if get_res == ARGV[1] then
    redis.call('HDEL', KEYS[1], KEYS[2])
    return {1, incr_res, get_res}
  else
    return {0, incr_res, get_res}
  end

else
  return {-1, incr_res}
end
-- join_game_session [players_hash_fields...] [players_hash, user_ids_hash, subscriptions_hash, player_name, user_id]
local nil_idx = nil
local vals = redis.call('HMGET', ARGV[1], unpack(KEYS))

for i, val in ipairs(vals) do
  if val == ARGV[4] then
    redis.call('HINCRBY', ARGV[3], ARGV[5], 1)
    return {"already_present", vals}
  end
  if not val and not nil_idx then nil_idx = i end
end

if nil_idx ~= nil then
  redis.call('HSET', ARGV[1], KEYS[nil_idx], ARGV[4])
  redis.call('HSET', ARGV[2], KEYS[nil_idx], ARGV[5])
  redis.call('HINCRBY', ARGV[3], ARGV[5], 1)
  local new_vals = redis.call('HMGET', ARGV[1], unpack(KEYS))
  return {"joined", new_vals}
else
  return {"session_full", vals}
end
-- hcad - hash compare and delete
-- hcad [hash, field] [assert_value]
local res = redis.call('HGET', KEYS[1], KEYS[2])
if res == ARGV[1] then
  redis.call('HDEL', KEYS[1], KEYS[2])
  return {1}
else
  return {0, res}
end
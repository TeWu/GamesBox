-- hcas - hash compare and set
-- hcas [hash, field] [assert_value, set_value]
local res = redis.call('HGET', KEYS[1], KEYS[2])
if res == ARGV[1] then
  redis.call('HSET', KEYS[1], KEYS[2], ARGV[2])
  return {1, ARGV[2]}
else
  return {0, res}
end
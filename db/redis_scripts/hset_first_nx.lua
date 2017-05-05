if #KEYS >= 1 and #ARGV >= 2 then
  local i = 1
  local res = 0

  repeat
    res = redis.call('HSETNX', ARGV[1], KEYS[i], ARGV[2])
    i = i + 1
  until res ~= 0 or i > #KEYS

  if res ~= 0 then
    return i - 2
  end
end
return nil
-- game_reset [game_session_key_prefix]
local keys = redis.call('KEYS', KEYS[1] .. '*')
for i=#keys,1,-1 do
  if keys[i]:find("players") then
    table.remove(keys, i)
  end
end
return redis.call('DEL', unpack(keys))
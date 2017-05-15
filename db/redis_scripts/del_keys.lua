-- del_keys [pattern]
return redis.call('DEL', unpack(redis.call('KEYS', KEYS[1])))
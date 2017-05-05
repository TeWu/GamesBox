module GamesBox
  configs = YAML.load( File.read File.join(Rails.root, 'config', 'redis.yml') )
  REDIS_CONFIG = configs['default'].merge(configs[Rails.env] || {}).with_indifferent_access.freeze

  # Instantiate Redis client (thread-safe)
  $redis = Redis.new(REDIS_CONFIG)

  # Load scripts
  REDIS_SCRIPTS = Dir[File.join(Rails.root, 'db', 'redis_scripts', '*.lua')].map do |filepath|
                    sha = $redis.script(:load, File.read(filepath))
                    name = File.basename(filepath, '.lua')
                    [name, sha]
                  end.to_h.with_indifferent_access.freeze

  # Remove all keys from test database
  $redis.flushdb if Rails.env == "test"
end
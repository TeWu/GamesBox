module GamesBox
  configs = YAML.load( ERB.new(File.read(File.join(Rails.root, 'config', 'redis.yml'))).result )
  REDIS_CONFIG = configs['default'].merge(configs[Rails.env] || {}).with_indifferent_access.freeze

  # Instantiate Redis client (thread-safe)
  $redis = Redis.new(REDIS_CONFIG)

  # Load scripts
  REDIS_SCRIPTS = Dir[File.join(Rails.root, 'db', 'redis_scripts', '*.lua')].map do |filepath|
                    sha = $redis.script(:load, File.read(filepath))
                    name = File.basename(filepath, '.lua')
                    [name, sha]
                  end.to_h.with_indifferent_access.freeze

  # Define evalscript helper
  def $redis.eval_script(name, *args)
    evalsha(REDIS_SCRIPTS[name], *args)
  end

  # Remove all keys from test database
  $redis.flushdb if Rails.env == "test"
end
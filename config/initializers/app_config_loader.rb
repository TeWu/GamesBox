module GamesBox
  configs = YAML.load( File.read File.join(Rails.root, 'config', 'app_config.yml') )
  CONFIG = configs['default'].merge(configs[Rails.env] || {}).with_indifferent_access

  ##----- Additional config processing -----#
  ## Auth
  CONFIG[:roles_values] = CONFIG[:roles].map { |role, i| [role, 2**i] }.to_h
  CONFIG[:roles_values_inverse] = CONFIG[:roles_values].invert
  CONFIG[:granting_roles] = CONFIG[:roles].keys.select do |role|
    ability = Ability.new MockUser.new(roles: [role]), skip_precondition: true # Using MockUser instead of User to avoid connecting to database, which would raise exception if database is not set up (e.g. this initializer is run in order to initialzie environment for db:setup rake task).
    Ability::GRANTING_ACTIONS.any? do |granting_action|
      ability.can? granting_action, User
    end
  end
  CONFIG[:nongranting_roles] = CONFIG[:roles].keys - CONFIG[:granting_roles]
  CONFIG[:new_user_roles_default] = CONFIG[:new_user_roles_default].select { |r| r.in? CONFIG[:nongranting_roles] } # For increased security deny setting granting roles as default roles for new users

  ## Game sessions
  CONFIG[:channel_id_gen] = proc {|game_id, session_id, is_public| "game-ses:#{game_id}:#{is_public ? "" : 'private:'}#{session_id}" }
  CONFIG[:public_sessions_key_gen] = proc {|game_id| "public-game-ses:#{game_id}" }

  CONFIG.freeze
end
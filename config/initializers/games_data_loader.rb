module GamesBox
  GAMES = YAML.load( File.read File.join(Rails.root, 'config', 'games.yml') )
          .map{|game| game.merge(url_segment: game['name'].parameterize) }
          .map{|game| [game[:url_segment], game.with_indifferent_access]}
          .to_h

  GAMES.freeze
end
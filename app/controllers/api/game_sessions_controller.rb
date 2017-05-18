module Api
  class GameSessionsController < ApplicationController
    GAMES_IDS = GamesBox::GAMES.keys

    def index
      authorize! :index, :game_session
      games_ids = params[:game_id] ? [params[:game_id]] : GAMES_IDS
      sessions = games_ids.map do |game_id|
        game_sessions_key = GamesBox::CONFIG[:public_sessions_key_gen].call(game_id)
        game_sessions = $redis.smembers(game_sessions_key).map do |session_id|
          redis_key = GamesBox::CONFIG[:channel_id_gen].call(game_id, session_id, true)
          players = $redis.hgetall(redis_key + ':players') # TODO: move ':players' string to config
          players = ['0', '1'].map{|i| players[i] }
          {id: session_id, players: players}
        end
        [game_id, game_sessions]
      end.to_h
      render json: sessions
    end

  end
end

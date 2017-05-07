class GameSessionChannel < ApplicationCable::Channel
  attr_accessor :channel_id, :subscription_id, :state

  def subscribed
    self.channel_id = "game-ses:#{params[:game_id]}:#{params[:session_id]}"
    self.subscription_id = "user:#{current_user.id}:#{GamesBox::Utils.random_id(7)}"
    self.state = {}
    stream_from subscription_id
    stream_from channel_id
  end

  def unsubscribed
    leave
  end

### ----> TODO <------ Make this channel stateless - always go to Redis for state info

  def join()
    players_precedence = [0, 1].shuffle
    outcome, players = $redis.eval_script(:join_game_session,
                                           players_precedence,
                                           [redis_key(:players), current_player_name,
                                            redis_key(:players, :subs), current_user.id]
                                         )
    if outcome != -1
      state[:current_player_num] = players_precedence[players.index(current_player_name)]
      state[:players] = players_precedence.zip(players).sort.map {|p| p[1] }

      send_to_current_user(type: :join_accepted, payload: state)
      broadcast(type: :player_joined, payload: state[:players]) if outcome == 1
    else
      send_to_current_user(type: :join_rejected)

      ## TODO: handle full session (outcome == -1)

    end
  end

  def leave()
    if state[:current_player_num]
      outcome, _ = $redis.eval_script(:leave_game_session,
                                       [redis_key(:players), state[:current_player_num],
                                        redis_key(:players, :subs), current_user.id],
                                       [current_player_name]
                                     )
      broadcast(type: :player_left, payload: state[:current_player_num]) if outcome == 1
      self.state = {}
    end
  end


  private

  def broadcast(msg)
    ActionCable.server.broadcast(channel_id, msg)
  end

  def send_to_current_user(msg)
    ActionCable.server.broadcast(subscription_id, msg)
  end

  def current_player_name
    current_user.display_name
  end

  def redis_key(*subkeys)
    [channel_id, *subkeys] * ':'
  end

end

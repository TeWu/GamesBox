class GameSessionChannel < ApplicationCable::Channel
  attr_accessor :channel_id, :state

  def subscribed
    self.channel_id = "game-ses:#{params[:game_id]}:#{params[:session_id]}"
    self.state = {}
  end

  def unsubscribed
    leave
  end

  def receive(data)
    type, payload = data['m']
    type = type.to_sym

    join and return if(type == :join)

    if state[:current_player_num]
      case type.to_sym
        when :get_state then get_state
        when :leave then leave
      end
    end
  end


  protected

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

      stream_from channel_id
      deliver(:join_accepted)
      broadcast(:player_joined, {num: state[:current_player_num], name: current_player_name}) if outcome == 1
    else
      deliver(:join_rejected, {reason: :session_full})
    end
  end

  def get_state()
    broadcast(:current_state, state.except(:current_player_num))
  end

  def leave()
    if state[:current_player_num]
      outcome, _ = $redis.eval_script(:leave_game_session,
                                       [redis_key(:players), state[:current_player_num],
                                        redis_key(:players, :subs), current_user.id],
                                       [current_player_name]
                                     )
      broadcast(:player_left, state[:current_player_num]) if outcome == 1
      stop_stream channel_id
      self.state = {}
    end
  end


  def current_player_name
    current_user.display_name
  end

  def redis_key(*subkeys)
    [channel_id, *subkeys] * ':'
  end

  def broadcast(type, payload = nil)
    ActionCable.server.broadcast(channel_id, payload ? [type, payload] : [type])
  end

  def deliver(type, payload = nil)
    payload ? transmit([type, payload]) : transmit([type])
  end

  def stop_stream(broadcasting)
    broadcasting = String(broadcasting)
    broadcasting, callback = streams.find{|x| x[0] == broadcasting }
    pubsub.unsubscribe broadcasting, callback
  end

end

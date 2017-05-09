class GameSessionChannel < ApplicationCable::Channel
  attr_accessor :channel_id

  def subscribed
    self.channel_id = "game-ses:#{params[:game_id]}:#{params[:session_id]}"

    outcome, player_num = join_game_session
    if outcome != :session_full
      broadcast(:player_joined, {num: player_num, name: current_player_name}) if outcome == :joined
      stream_from channel_id
    else
      deliver(:join_rejected, {reason: :session_full})
      reject
    end
  end

  def unsubscribed
    return if subscription_rejected?
    outcome, player_num = leave_game_session
    broadcast(:player_left, player_num) if outcome == :left
  end

  def receive(data)
    type, payload = data['data']
    type = type.to_sym

    case type
      when :get_state then get_state
    end
  end


  protected

  def get_state
    state = $redis.hgetall(redis_key)
    players = $redis.hgetall(redis_key(:players))
    state[:players] = ['0', '1'].map{|i| players[i] }
    broadcast(:current_state, state)
  end


  def join_game_session
    player_num_preference = [0, 1].shuffle
    outcome, players = $redis.eval_script(:join_game_session,
                                           player_num_preference,
                                           [redis_key(:players), current_player_name,
                                            redis_key(:players, :subs), current_user.id]
                                         )
    player_num = outcome == 'session_full' ? nil : player_num_preference[players.index(current_player_name)]
    [outcome.to_sym, player_num]
  end

  def leave_game_session
    outcome, *rest = $redis.eval_script(:leave_game_session,
                                         [redis_key(:players), redis_key(:players, :subs), current_user.id],
                                         [current_player_name]
                                       )
    player_num = outcome == 'left' ? rest.shift : nil
    [outcome.to_sym, player_num, *rest]
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

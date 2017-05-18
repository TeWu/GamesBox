class GameSessionChannelBase < ApplicationCable::Channel
  attr_accessor :channel_id, :session_id

  def subscribed
    self.session_id = params[:session_id]
    self.channel_id = GamesBox::CONFIG[:channel_id_gen].call(game_id, session_id, public_session?)

    outcome, player_num, players = join_game_session
    if outcome != :session_full
      initialize_session if players.compact.size == 1
      broadcast(:player_joined, {num: player_num, name: current_user_name}) if outcome == :joined
      stream_from channel_id
    else
      reject(reason: :session_full)
    end
    [outcome, player_num, players]
  end

  def unsubscribed
    return if subscription_rejected?
    outcome, player_num, is_session_empty = leave_game_session
    broadcast(:player_left, player_num) if outcome == :left
    tear_down_session if is_session_empty
    [outcome, player_num, is_session_empty]
  end

  def receive(data)
    type, payload = data['data']
    type = type.to_sym

    case type
      when :get_state then broadcast(:current_state, get_state)
    end

    [type, payload]
  end


  protected

  def join_game_session
    order = join_order
    outcome, players = $redis.eval_script(:join_game_session,
                                           order,
                                           [redis_key(:players), redis_key(:players, 'user-ids'),
                                            redis_key(:players, :subs), current_user_name, current_user.id]
                                         )
    player_num = outcome == 'session_full' ? nil : order[players.index(current_user_name)]
    [outcome.to_sym, player_num, players]
  end

  def leave_game_session
    outcome, is_session_empty, *rest = $redis.eval_script(:leave_game_session,
                                         [redis_key(:players), redis_key(:players, 'user-ids'),
                                          redis_key(:players, :subs)],
                                         [current_user_name, current_user.id]
                                       )
    player_num = outcome == 'left' ? rest.shift : nil
    [outcome.to_sym, player_num, !!is_session_empty, *rest]
  end

  def get_state
    state = $redis.hgetall(redis_key)
    state.update(state) {|k,v| v.numeric? ? v.to_f : v }
    players = $redis.hgetall(redis_key(:players))
    state[:players] = ['0', '1'].map{|i| players[i] }
    state
  end

  def public_session?
    params[:is_public]
  end

  def current_user_name
    current_user.display_name
  end

  def join_order
    [0, 1].shuffle
  end

  def initialize_session
    $redis.sadd(public_sessions_key, session_id) if public_session?
    initialize_state
  end

  def tear_down_session
    $redis.srem(public_sessions_key, session_id) if public_session?
    tear_down_state
  end

  def initialize_state
  end

  def tear_down_state
    $redis.eval_script(:del_keys, [redis_key + '*'])
  end

  def redis_key(*subkeys)
    [channel_id, *subkeys] * ':'
  end

  def public_sessions_key
    @public_sessions_key ||= GamesBox::CONFIG[:public_sessions_key_gen].call(game_id)
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


  class << self
    attr_accessor :game_id
  end

  def game_id
    self.class.game_id
  end

end
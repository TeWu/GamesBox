
# TODO: merge/synchronize with JS Black Hole config
module GamesBox
  module Games
    module BlackHole
      CONFIG = {
        board_size: 6,
        circles_in_rack: 10
      }
    end
  end
end

BH = GamesBox::Games::BlackHole

class BlackHoleGameChannel < GameSessionChannelBase
  self.game_id = 'black-hole'

  def unsubscribed
    _ , player_num = super
    $redis.hdel(redis_key(:rematch), player_num)
  end

  def receive(data)
    type, payload = super(data)

    case type
      when :move then move(**payload.symbolize_keys)
      when :rematch_request then rematch_request(payload)
    end
  end

  def initialize_state
    current_player = rand(2)
    $redis.hset(redis_key, :current_player, current_player)
    current_player
  end

  def get_state
    state = super.merge(board: get_board_data)
    if state.has_key? 'winner_name'
     state[:black_hole] = $redis.hgetall(redis_key(:black_hole))
                          .map {|k, v| [k, v.to_i] }.to_h
     state[:scores] = $redis.lrange(redis_key(:scores), 0, 1).map(&:to_i)
     rematch = $redis.hkeys(redis_key(:rematch)).map(&:to_i)
     state[:rematch] = rematch unless rematch.empty?
    end
    state
  end

  def get_board_data
    $redis.hgetall(redis_key(:board))
  end

  def move(turn_num:, i:, j:)
    outcome = $redis.eval_script(:black_hole_move,
                                  [redis_key],
                                  [turn_num, "#{i}:#{j}", current_user_name]
                                )
    if outcome == 'ok'
      broadcast(:move, {turn_num: turn_num, i: i, j: j})
      end_game if turn_num == 2 * BH::CONFIG[:circles_in_rack] - 1
    else
      deliver(:move_rejected, {turn_num: turn_num, reason: outcome})
    end
  end

  def rematch_request(requesting_players)
    requesting_players.each do |player_num|
      $redis.hset(redis_key(:rematch), player_num, 1)
    end
    if $redis.hlen(redis_key(:rematch)) == 2
      reset_game
    else
      broadcast(:rematch_pending, requesting_players)
    end
  end


  def end_game
    board = BH::Board.new(get_board_data)
    black_hole = board.find_empty_circle()
    consumed_circles = board.find_neighbours(black_hole)
    scores = calculate_scores(consumed_circles)
    winnerNum = scores[0] < scores[1] ? 0 : 1
    winnerNum = nil if scores[0] == scores[1]
    winnerName = winnerNum.nil? ? nil : $redis.hget(redis_key(:players), winnerNum)

    $redis.hset(redis_key(:black_hole), :i, black_hole[:i])
    $redis.hset(redis_key(:black_hole), :j, black_hole[:j])
    $redis.rpush(redis_key(:scores), scores)
    $redis.hset(redis_key, :winner_name, winnerName)

    broadcast(:end_game, {black_hole: black_hole, scores: scores, winner_name: winnerName})
    persist_game_session
  end

  def calculate_scores(consumed_circles)
    consumed_circles.map {|c| c.split(',').map(&:to_i) }
                    .reduce([0, 0]) do |scores, circle|
                       value, player_num = circle
                       scores[player_num] += value
                       scores
                    end
  end

  def reset_game
    $redis.eval_script(:game_reset, [redis_key])
    current_player = initialize_state
    broadcast(:reset, current_player)
  end

  def persist_game_session
    players_user_ids, scores, moves, starting_player = $redis.eval_script(:black_hole_snapshot, [redis_key])

    players_user_ids = players_user_ids.each_slice(2).to_a.sort.map {|x| x[1].to_i }
    scores = scores.map(&:to_i)
    encoded_moves = encode_moves(
      moves.map do |move_str|
        convert_move_coordinate(*move_str.split(':').map(&:to_i))
      end
    )

    session = BlackHoleGameSession.new(
      series_id: session_id,
      player0_id: players_user_ids[0],
      player1_id: players_user_ids[1],
      score0: scores[0],
      score1: scores[1],
      is_player0_starting: starting_player == '0',
      moves: encoded_moves
    )

    session.save!
    broadcast(:saved)
  rescue
    broadcast(:save_failed)
  end

  def convert_move_coordinate(i, j)
    (i * (i + 1)) / 2 + j
  end

  def encode_moves(array)
    array.map {|x| x.to_s(2).rjust(5, '0') }
         .join.chars.each_slice(8).to_a
         .map {|arr| arr.join.ljust(8,'0').to_i(2) }
         .pack('C*')
  end

  def decode_moves(bytes)
    bytes.unpack('C*')
         .map {|x| x.to_s(2).rjust(8,'0') }
         .join[0,100].chars.each_slice(5).to_a
         .map {|x| x.join.to_i(2) }
  end

end
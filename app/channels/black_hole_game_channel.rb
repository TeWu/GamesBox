
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
     scores = $redis.hgetall(redis_key(:scores))
     state[:scores] = ['0', '1'].map{|i| scores[i].to_i }
     rematch = $redis.hkeys(redis_key(:rematch)).map(&:to_i)
     state[:rematch] = rematch unless rematch.empty?
    end
    state
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
    scores.each.with_index do |score, i|
      $redis.hset(redis_key(:scores), i, score)
    end
    $redis.hset(redis_key, :winner_name, winnerName)

    broadcast(:end_game, {black_hole: black_hole, scores: scores, winner_name: winnerName})
  end

  def calculate_scores(consumed_circles)
    consumed_circles.map {|c| c.split(',').map(&:to_i) }
                    .reduce([0, 0]) do |scores, circle|
                       value, player_num = circle
                       scores[player_num] += value
                       scores
                    end
  end

  def get_board_data
    $redis.hgetall(redis_key(:board))
  end

  def reset_game
    $redis.eval_script(:game_reset, [redis_key])
    current_player = initialize_state
    broadcast(:reset, current_player)
  end

end
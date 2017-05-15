
# TODO: merge/synchronize with JS Black Hole config
module GamesBox
  module Games
    module BlackHole
      CONFIG = {
        board_size: 6
      }
    end
  end
end

BH = GamesBox::Games::BlackHole

class BlackHoleGameChannel < GameSessionChannelBase
  self.game_id = 'black-hole'

  def initialize_state
    $redis.hset(redis_key, :current_player, rand(2))
  end

  def receive(data)
    type, payload = super(data)

    case type
      when :move then move(**payload.symbolize_keys)
    end
  end

  def get_state
    super.merge(board: get_board)
  end

  def move(turn_num:, i:, j:)
    outcome = $redis.eval_script(:black_hole_move,
                                  [redis_key],
                                  [turn_num, "#{i}:#{j}", current_user_name]
                                )
    if outcome == 'ok'
      broadcast(:move, {turn_num: turn_num, i: i, j: j})
    else
      deliver(:move_rejected, {turn_num: turn_num, reason: outcome})
    end
  end


  def get_board
    $redis.hgetall(redis_key(:board))
  end

end
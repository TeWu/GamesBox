
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
    $redis.hset(redis_key, :starting_player, rand(2))
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
    $redis.hincrby(redis_key, :turn_num, 1)
    broadcast(:move, {turn_num: turn_num, i: i, j: j})
  end


  def get_board
    $redis.hgetall(redis_key(:board))
  end

  def get_board_circle(i, j)
    $redis.hget(redis_key(:board), "#{i}:#{j}")
  end

  def set_board_circle(i, j, circle)
    $redis.hset(redis_key(:board), "#{i}:#{j}", circle)
  end

end
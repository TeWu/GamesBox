class BlackHoleGameChannel < GameSessionChannelBase
  self.game_id = 'black-hole'

  def receive(data)
    type, payload = super(data)

    case type
      when :noop then noop = 42
    end
  end

end
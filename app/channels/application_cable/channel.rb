module ApplicationCable
  class Channel < ActionCable::Channel::Base

    def reject(reason: nil)
      transmit(['_AC:GBBC_rejected', reason])
      super()
    end

  end
end
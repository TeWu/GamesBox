module ApplicationCable
  class Channel < ActionCable::Channel::Base

    # before_unsubscribe do
    #   transmit(['_AC:GBBC_unsubscribed']) unless subscription_rejected?
    # end

    def reject(reason: nil)
      transmit(['_AC:GBBC_rejected', reason])
      super()
    end

  end
end
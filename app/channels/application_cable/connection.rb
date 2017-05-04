module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def authentication_proxy
      @authentication_proxy ||= GamesBox::Authentication::AuthProxy.new(cookies)
    end

    def find_verified_user
      if verified_user = User.find_by(id: authentication_proxy.current_user_id)
        verified_user
      else
        reject_unauthorized_connection
      end
    end

  end
end

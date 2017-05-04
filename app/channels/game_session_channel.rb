class GameSessionChannel < ApplicationCable::Channel

  def subscribed
    puts "GameSessionChannel subscribed (#{params[:id]} | #{current_user.display_name})"
    stream_from params[:id]
  end

  def unsubscribed
    puts "GameSessionChannel unsubscribed (#{params[:id]} | #{current_user.display_name})"
  end

end

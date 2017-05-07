module GamesBox
  module Utils
    class << self

      def random_id(len)
        # @random_id_charset ||= [*('A'..'Z'),*('a'..'z'),*('0'..'9')]
        # (0..len).map{ @random_id_charset.sample }.join
        SecureRandom.urlsafe_base64((len*0.75).ceil)[0,len].tr('-_','7b')
      end

    end
  end
end

module GamesBox
  module StringExtensions
    def integer?
      Integer(self) != nil rescue false
    end

    def numeric?
      Float(self) != nil rescue false
    end
  end
end

String.include GamesBox::StringExtensions
class BlackHoleGameSession < ApplicationRecord
  belongs_to :player0, class_name: 'User', inverse_of: nil
  belongs_to :player1, class_name: 'User', inverse_of: nil
end
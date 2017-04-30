module GamesBox
  module Serializers
    class RolesBitmaskSerializer < BitmaskSerializer

      def initialize
        @bitval2obj = GamesBox::CONFIG[:roles_values_inverse]
        @obj2bitval = lambda { |key| GamesBox::CONFIG[:roles_values][key.to_sym] }
      end

      class << self
        def instance
          @instance ||= RolesBitmaskSerializer.new
        end

        delegate :load, :dump, to: :instance
      end

    end
  end
end
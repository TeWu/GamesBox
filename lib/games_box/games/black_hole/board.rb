module GamesBox
  module Games
    module BlackHole

      class Board < Struct.new(:content)
        NEIGHBOURHOOD = [
          [-1, -1], [0, -1],
          [-1,  0], [1,  0],
          [ 0,  1], [1,  1]
        ]

        def find_empty_circle
          for i in 0...CONFIG[:board_size]
            for j in 0..i
              return {i: i, j: j} unless content["#{i}:#{j}"]
            end
          end
        end

        def find_neighbours(circle)
          NEIGHBOURHOOD.map do |i, j|
            content["#{circle[:i] + i}:#{circle[:j] + j}"]
          end.compact
        end

      end

    end
  end
end
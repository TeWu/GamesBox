class ChangeBlackHoleGameSessions < ActiveRecord::Migration[5.1]
  FOREIGN_KEY_COLUMNS = [:player0_id, :player1_id]

  def up
    FOREIGN_KEY_COLUMNS.each do |column|
      remove_foreign_key :black_hole_game_sessions, column: column
    end
    rename_table :black_hole_game_sessions, :black_hole_archived_game_sessions
  end

  def down
    rename_table :black_hole_archived_game_sessions, :black_hole_game_sessions
    FOREIGN_KEY_COLUMNS.each do |column|
      add_foreign_key :black_hole_game_sessions, :users, column: column
    end
  end
end
class CreateBlackHoleGameSessions < ActiveRecord::Migration[5.1]
  def change
    create_table :black_hole_game_sessions do |t|
      t.string :series_id, null: false
      t.references :player0, null: false, index: true, foreign_key: {to_table: :users} # NOTE: This wouldn't be reverted automatically if the foreign key was added outside the 'create_table' call
      t.references :player1, null: false, index: true, foreign_key: {to_table: :users}
      t.integer :score0, null: false
      t.integer :score1, null: false
      t.boolean :is_player0_starting, null: false
      t.binary :moves, null: false
      t.datetime :created_at, null: false
    end
  end
end